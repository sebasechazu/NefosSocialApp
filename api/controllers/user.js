'use strict'
// ------------------------------------------------------------------------------------------------
// CONTROLADOR DE USUARIO
// ------------------------------------------------------------------------------------------------
// Importamos el modulo de encriptaion 
var bcrypt = require('bcrypt-nodejs');
// Importamos el modulo de Paginacion en mongoose
var mongoosePaginate = require('mongoose-pagination');
// Importamos el modulo fs para trabajar con archivos
var fs = require('fs');
// importamos el modulo  path para trabajar con archivos
var path = require('path');
// ------------------------------------------------------------------------------------------------
// MODELOS
// ------------------------------------------------------------------------------------------------
var User = require('../models/User');
var Follow = require('../models/Follow');
var Publication = require('../models/Publication');
//-------------------------------------------------------------------------------------------------
// SERVICIOS
//-------------------------------------------------------------------------------------------------
// importamos el servico de jwt para generar tokens
var jwt = require('../services/jwt');//servicios 
//-------------------------------------------------------------------------------------------------
// REGISTRAR USUARIO 
//-------------------------------------------------------------------------------------------------
function registerUser(req, res) {
    // Obtenemos los campos del formulario
    var params = req.body;
    // Creamos un objeto de usuario como variable user
    var user = new User();
    // Comprueba si recibe los parametros los parametros obligatorios para registrar 
    if (params.name && params.surname && params.nickname && params.email && params.password) {
        // Guardamos en la variable user los datos de la solicitud
        user.name = params.name;
        user.surname = params.surname;
        user.nickname = params.nickname;
        user.email = params.email;
        user.password = params.password;
        // Guardamos el rol y la imagen con valores por defecto
        user.role = 'ROLE_USER';
        user.image = null;
        // Verificamos si ya existe en la base de datos un usuario y un email
        User.find({
            $or: [
                { email: user.email.toLowerCase() },
                { nickname: user.nickname.toLowerCase() }
            ]
        }).exec((err, users) => {
            // si existe un error en peticion enviamos una respuesta con el error 500
            if (err) return res.status(500).send({ message: 'Error en la peticion' });
            // si el usuario existe y no es mayor e igual que 0 informamos que existe
            if (users && users.length >= 1) {
                return res.status(200).send({ mesagge: 'el usuario que intentas registrar ya existe' });
            } else {
                // Si El usuario no existe, cifra y guarda los datos del usuario y del password
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    //el password se envia cifrada con bcrypt
                    user.password = hash;
                    // guardamos el usuaro
                    user.save((err, userStore) => {
                        // Si existe un error al guardar el usuario informamos con un error 500
                        if (err) return res.status(500).send({ mesagge: 'error al guardar el usuario' });
                        // Si todo esta correcto el api nos responde los datos del usuario guardado
                        if (userStore) {
                            // con un codigo de respuesta 200
                            res.status(200).send({ user: userStore });
                        } else {
                            //si no pudo alamcenar al usuario en la base de datos devuelve un 404
                            res.status(404).send({ mesagge: 'no se ha registrado el usuario' });
                        }
                    });
                });
            }
        });
        // Enviamos una respuesta de si no estan todos los campos del formulario completos
    } else {
        res.status(200).send({ mesagge: 'Envia todos los campos necesarios' });
    }
}
//-------------------------------------------------------------------------------------------------
// LOGIN DE USUARIO
//-------------------------------------------------------------------------------------------------
function loginUser(req, res) {
    // Obtenemos de la solicitud el email y el password de un usuario registrado
    var params = req.body;
    var email = params.email;
    var password = params.password;
    // si los campos no estan completos envia un CR 404
    if (email && password) {
        // Intentamos bucar en la coleccion User al usuario por mail email
        User.findOne({ email: email }, (err, user) => {
            // Si exite un error en esta peticion informamos con un CR 500
            if (err)
                return res.status(500).send({ message: 'error en la peticion' });
            // Si encontramos al usuario en la base de datos
            if (user) {
                // Comparamos la contraseña  encriptada del usuario
                bcrypt.compare(password, user.password, (err, check) => {
                    // Si es correcto
                    if (check) {
                        // si ademas solicitamos que nos envia el toquen de verificacion
                        if (params.gettoken) {
                            // Devolvemos un codigo de respuesta 200 y el token token
                            return res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            // si no solicitamos el token devolvemos los datos del usuario
                            user.password = undefined;
                            return res.status(200).send({ user });
                        }
                        // si la contraseña es incorrecta enviamos el codigo de respuesta 500 
                    } else {
                        return res.status(500).send({ message: 'la contraseña es incorrecta' });
                    }
                });
                // si el usuario no esta registrado en la base de datos enviamos un codigo de respuesta 404
            } else {
                return res.status(404).send({ message: 'el email ingresado no se encuentra registado' });
            }
        });
        // si el ususario no completo los campos 
    } else {
        return res.status(404).send({ message: 'debe completar todos los campos' })
    }
}
//-------------------------------------------------------------------------------------------------
// DATOS DE UN USUARIO 
//-------------------------------------------------------------------------------------------------
function getUser(req, res) {
    //obtenemos del request los datos del usuario
    var userId = req.params.id;
    //buscamos al usuario en la base de datos
    User.findById(userId, (err, user) => {
        // si existe un error en la peticion enviamos un CR 500
        if (err)
            return res.status(500).send({ message: 'error en la peticion' });
        //si el usuario no existe enla base de datos
        if (!user)
            return res.status(404).send({ message: 'El Usuario no existe' });
        // si el usuario existe en labase de datos ejecutamos una funcion asincrona
        followThisUser(req.user.sub, userId).then((value) => {
            // bloqueamos en envio del password
            user.password = undefined;
            // enviamos un codigo de respuesta 200 con los datos de usaurio mas la lista de seguimeinto
            return res.status(200).send({
                user,
                following: value.following,
                followed: value.followed
            });
        });
    });
}
// ----------------------------------------------
// OBTENER LOS RESULTADOS DE FOLLOWING
// ----------------------------------------------
async function followThisUser(identity_user_id, user_id) {
    // ingresamos a la funcion un id de usuario logueado utilizamos la entidad follow 
    // listamos usuarios que seguimos por id
    var following = await Follow.findOne({ "user": identity_user_id, "followed": user_id })
        .exec().then((follow) => {
            return follow;
        }).catch((err) => { return handleError(err) });
    // listaos usuarios listamos los usuarios que nossiguen por id
    var followed = await Follow.findOne({ "user": user_id, "followed": identity_user_id })
        .exec().then((follow) => {
            return follow;
        }).catch((err) => { return handleError(err) });
    return {
        // devolvemos seguidores y seguidos
        following: following,
        followed: followed
    }
}
// ------------------------------------------------------------------------------------------------
// LISTADO DE USUARIOS PAGINADOS
// ------------------------------------------------------------------------------------------------
function getUsers(req, res) {
    // obtenemos de la solitud el id del usuario logueado
    var identity_users_id = req.user.sub;
    // declaramos una variabole pagina y la inicializamos en 1
    var page = 1;
    // obtenemos por parametro de la solicitud un numero de pagina
    if (req.params.page) {
        page = req.params.page
    }
    // inicicalizamos la variable item por pagina y la inicicalizamos en 4
    var itemsPerPage = 4;
    // Buscamos en la base de datos  la lista de usuarios registrados que seran dividias 
    // por pagina de acuerdo a lo que reciba como parametro como pagina y en la cantidad 
    // de usarios por pagina
    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        // si existe un error en la peticionenviamos un codigo re respuesta 500 
        if (err) return res.status(500).send({ message: 'Existe un error en la peticion' });
        // Si no existe usuarios para listar enviamos un codigo de respuesta 404
        if (!users) return res.status(404).send({ mesagge: 'no hay usuarios disponibles' });
        // ejecutamos la funcion followUserId 
        followUserIds(identity_users_id).then((value) => {
            //enviamos un codigo de respuesta 200
            return res.status(200).send({
                // cantidad de usuarios 
                users,
                users_following: value.following,
                users_follow_me: value.followed,
                total,
                // la paginas
                pages: Math.ceil(total / itemsPerPage)
            });
        });
    });
}
// ----------------------------------------------
// FUNCION ASYNCRONA PARA OBTENER ESTADISTICAS 
// ----------------------------------------------
async function followUserIds(user_id) {
    try {
        // Buscamos dentro de follows la lista de usuarios que seguimos
        var following = await Follow.find({ "user": user_id }).select({ '_id': 0, '__v': 0, 'user': 0 }).exec()
            .then((follows) => { return follows; }).catch((err) => { return handleError(err) });
        // Buscamos dentro de follows la lista de usuarios que nos siguen
        var followed = await Follow.find({ "followed": user_id }).select({ '_id': 0, '__v': 0, 'followed': 0 }).exec()
            .then((follows) => { return follows; }).catch((err) => { return handleError(err) });
        // Procesar following Ids
        var following_clean = [];
        following.forEach((follow) => {
            following_clean.push(follow.followed);
        });
        // Procesar followed Ids
        var followed_clean = [];
        followed.forEach((follow) => {
            followed_clean.push(follow.user);
        });
        // Devolvemos la lista de usuario que seguimos y que nos siguen
        return {
            following: following_clean,
            followed: followed_clean
        }
    } catch (e) {
        console.log(e);
    }
}
// ------------------------------------------------------------------------------------------------
// ACTUALIZAR USUARIO 
// ------------------------------------------------------------------------------------------------
function updateUser(req, res) {
    // Obtenemos el id del usuario logueado
    var userId = req.params.id;
    // Obtenermos los datos que van a ser actualizados
    var update = req.body;
    // Borrar la propiedad password
    delete update.password;
    // corroborar si es el usuario logueado el que quiere actualizar datos 
    if (userId != req.user.sub) {
        // si existe un error en la peticion enviamos un codigo de respuesta 500
        return res.status(500).send({ message: 'No tienes permisos para actualizar datos' });
    }
    // corroborar si mail y contraseña se encuentran en la base de datos
    User.find({
        $or: [
            // pasamos los datos ingresados a minusculas
            { email: update.email.toLowerCase() },
            { nickname: update.nickname.toLowerCase() }
        ]
    }).exec((err, users) => {
        var userIsset = false;
        //comprobamos si el email y el sobrenombre pertenencen a otro usario
        users.forEach((user) => {
            if (user && user._id != userId) userIsset = true;
        });
        //comprobamos si el usuario esta en uso ok
        if (userIsset)
            return res.status(404).send({ message: 'los datos ya estan en uso' });
        //busca al usuario por id 
        User.findByIdAndUpdate(userId, update, { new: true, useFindAndModify: false },
            (err, userUpdated) => {
                //comprueba si hay error en la peticion
                if (err)
                    return res.status(500).send({ message: 'Existe un error en la peticion' });
                //comprueba si no hay usuario en la peticion
                if (!userUpdated)
                    return res.status(404)
                        .send({ message: 'No se ha podido actualizar el usuario' });
                //actualiza los datos del usuario
                return res.status(200).send({ user: userUpdated });
            });
    });
}
// ------------------------------------------------------------------------------------------------
// SUBIR ARCHIVOS DE IMAGENES
// ------------------------------------------------------------------------------------------------
function uploadImage(req, res) {
    // obtenemos de la solicitud el id de usuario
    var userId = req.params.id;
    // Obtenemos de la solicitud el archivo 
    if (req.files) {
        //individualizamos el path completo de la imagen que tratamos de subir
        var file_path = req.files.image.path;
        // individualizamos del path el nombre del archivo que intentamos subir
        var file_split = file_path.split('\\');
        // individualizamos el nombre completo del archivo
        var file_name = file_split[2];
        // individualizamos la extension del archivo
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        // Verificamos si el usuario que intenta subir la imagen es el usuario logueado
        if (userId != req.user.sub) {
            // si no es el usuario logueado ejecuta la funcion removeFilesOfUploads()
            return removeFilesOfUploads(res, file_path,
                'No tienes permisos para actualizar datos');
        }
        // Comprueba si el documento tiene una extension de archivo logueado
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jepg' || file_ext == 'gif') {
            // actualiza documento de usuario logueado
            User.findByIdAndUpdate(userId, { image: file_name },
                { new: true, useFindAndModify: false },
                (err, userUpdated) => {
                    // Si existe un error en la peticion envia un CR 500
                    if (err) return res.status(500)
                        .send({ message: 'Existe un error en la peticion' });
                    // si no se puede actualizar el usuario envia un CR 404
                    if (!userUpdated) return res.status(404)
                        .send({ message: 'No se ha podido actualizar el usuario' });
                    // Si todo fue correcta envia un CR 200 y un json con los datos del usuario
                    return res.status(200).send({ user: userUpdated });
                });
            // si la extension no fue valida ejecuta la funcion removeFilesOfUploads();
        } else {
            return removeFilesOfUploads(res, file_path, 'extension no valida');
        }
        // si no pudo obtener un archivo del requeriminto enviamos un CR 200
    } else {
        return res.status(200).send({ mesagge: ' no se han subido archivos' });
    }
}
// ----------------------------------------------
// FUNCION LOCAL PARA ELIMINAR ARCHIVOS DEL CACHE
// ----------------------------------------------
function removeFilesOfUploads(res, file_path, mensage) {
    // analiza la solicitud y elimina los archivos que se intentan subir
    fs.unlink(file_path, (err) => {
        // si la eliminacion fue correcta envia un CR 200 y un json con un mensaje
        return res.status(200).send({ mesagge: mensage });
    });
}
// ------------------------------------------------------------------------------------------------
// OBTENER IMAGEN DE USUARIO 
// ------------------------------------------------------------------------------------------------
function getImageFile(req, res) {
    // Obtiene de la solicitud el id de la imagen
    var image_File = req.params.imageFile;
    // crea la variable del url completa donde se ubica la imagen
    var path_file = './uploads/users/' + image_File;
    // Utilizamos fs para buscar el archivo
    fs.exists(path_file, (exists) => {
        // si la imagen existe en la url
        if (exists) {
            // envia la imagen como respuesta
            res.sendFile(path.resolve(path_file));
        } else {
            // si no encuentra la imagen envia un CR 200
            res.status(200).send({ mesagge: 'no existe la imagen' });
        }
    });
}
// ------------------------------------------------------------------------------------------------
// OBTENER CONTADORES
// ------------------------------------------------------------------------------------------------
function getCounters(req, res) {
    // Puede obtener por parametro un id usario registrado en la aplicacion
    var userId = req.user.sub;
    // Obtine el id del susario que inicio sesion a la aplicacion
    if (req.params.id) {
        userId = req.params.id;
    }
    // Ejecuta la funcion getcoutFollow y envia un CR 200 con los valores recibidos de la misma 
    getCountFollow(userId).then((value) => {
        return res.status(200).send(value);
    });
}
// ----------------------------------------------
// FUNCION ASYNCRONA PARA OBTENER LOS CONTADORES
// ----------------------------------------------
async function getCountFollow(user_id) {
    // Buscamos en Follow la cantidad de seguidos
    var following = await Follow.countDocuments({ "user": user_id })
        .exec()
        .then((count) => {
            return count;
        })
        .catch((err) => { return handleError(err); });
    // Buscamos en follow la cantidad de seguidores    
    var followed = await Follow.countDocuments({ "followed": user_id })
        .exec()
        .then((count) => {
            return count;
        })
        .catch((err) => { return handleError(err); });
    // Buscamos en Publicatios la cantidad de publicaciones
    var publications = await Publication.countDocuments({ 'user': user_id })
        .exec()
        .then((count) => {
            return count;
        })
        .catch((err) => { return handleError(err); });
    // Devolvemos los contadores 
    return {
        following: following,
        followed: followed,
        publications: publications
    }

}
// ------------------------------------------------------------------------------------------------
// EXPORTS
// ------------------------------------------------------------------------------------------------
module.exports = {
    registerUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile,
    getCounters
}