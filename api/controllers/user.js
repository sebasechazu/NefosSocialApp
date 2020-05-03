'use strict'
//-------------------------------------------------------------------------------------------------
//CONTROLADOR DE USUARIO
//-------------------------------------------------------------------------------------------------
// Modulo de encriptaion
var bcrypt = require('bcrypt-nodejs');
// Paginacion en mongoose
var mongoosePaginate = require('mongoose-pagination');
// Instanciamos fd para trabajar con archivos
var fs = require('fs');
// instanciamos path para trabajar con archivos
var path = require('path');
//-------------------------------------------------------------------------------------------------
// MODELOS
//-------------------------------------------------------------------------------------------------
var User = require('../models/User');
var Follow = require('../models/Follow');
var Publication = require('../models/Publication');
//-------------------------------------------------------------------------------------------------
// SERVICIOS
//-------------------------------------------------------------------------------------------------
var jwt = require('../services/jwt');//servicios 
//-------------------------------------------------------------------------------------------------
// METODO DE PRUEBA
//-------------------------------------------------------------------------------------------------
function pruebas(req, res) {
    console.log(req.body)
    res.status(200).send({ message: "metodo de pruebas desde user.js"});
}
//-------------------------------------------------------------------------------------------------
// REGISTRAR USUARIO 
//-------------------------------------------------------------------------------------------------
function saveUser(req, res) {
    //obtenemos los datos del usuario desde el body de la request
    var params = req.body;
    //creamos un usuario como variable
    var user = new User();
    //comprobamos y recibimos como parametros el nombre,apellido,nick, imail y password
    if (params.name && params.surname && params.nickname && params.email && params.password) {
        // Guardamos en la variable user los datos de la request
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
            if (err) return res.status(500).send({ message: 'Error en la peticion de usuarios' });
            //si el usuario existe y no es mayor e igual que 0 informamos el valor
            if (users && users.length >= 1) {
                return res.status(200).send({ mesagge: 'el usuario que intentas registrar ya existe' });
            } else {
                //cifra y guarda los datos del usuario y del password
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    //el password se envia cifrada con bcrypt
                    user.password = hash;
                    user.save((err, userStore) => {
                        if (err) return res.status(500).send({ mesagge: 'error al guardar el usuario' });
                        if (userStore) {
                            //si todo esta correcto el api nos devulve los datos del usuario guardado
                            res.status(200).send({ user: userStore });
                        } else {
                            res.status(404).send({ mesagge: 'no se ha registrado el usuario' });
                        }
                    });
                });
            }
        });
    } else {
        // Enviamos una respuesta de si no estan todos los campos del formulario completos
        res.status(200).send({ mesagge: 'Envia todos los campos necesarios!!!' });
    }
}
//-------------------------------------------------------------------------------------------------
// LOGIN DE USUARIO
//-------------------------------------------------------------------------------------------------
function loginUser(req, res) {
    //obtenemos de la request el imail y el password ingresado
    var params = req.body;
    var email = params.email;
    var password = params.password;
    //busqueda de un solo registro si encuentra el mail en la base de datos
    User.findOne({ email: email }, (err, user) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' });
        //si encontramos al usuario
        if (user) {
            //comparamos al usuario en la base de datos
            bcrypt.compare(password, user.password, (err, check) => {
                //si es correcto
                if (check) {
                    //si obtenemos el token
                    if (params.gettoken) {
                        //devolver token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    } else {
                        //devolcer datos del usuario
                        user.password = undefined;
                        return res.status(200).send({ user });
                    }
                } else {
                    return res.status(500).send({ message: 'el usuario no se ha podido identificar' });
                }
            })
        } else {
            return res.status(404).send({ message: 'el usuario no se ha podido identificar!!!' });
        }
    });
}
//-------------------------------------------------------------------------------------------------
// DATOS DE UN USUARIO 
//-------------------------------------------------------------------------------------------------
function getUser(req, res) {
    //obtenemos del request los datos del usuario
    var userId = req.params.id;
    //buscamos al usuario en la base de datos
    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' });
        //si el usuario no existe
        if (!user) return res.status(404).send({ message: 'El Usuario no existe' });

        followThisUser(req.user.sub, userId).then((value) => {
            user.password = undefined;
            return res.status(200).send({
                user,
                following: value.following,
                followed: value.followed
            });
        });
    });
}
//-------------------------------------------------------------------------------------------------
//FUNCION ASYNCRONA PARA OBTENER LOS RESULTADOS DE FOLLOWING DENTRO DE USER 
//-------------------------------------------------------------------------------------------------
async function followThisUser(identity_user_id, user_id) {
    // ingresamos a la funcion un id de usuario logueado
    // listamos usuaris seguidos
    var following = await Follow.findOne({ "user": identity_user_id, "followed": user_id })
        .exec().then((follow) => {
            return follow;
        }).catch((err) => { return handleError(err) });
    // listaos usuarios seguidos
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

//-------------------------------------------------------------------------------------------------
// LISTADO DE USUARIOS PAGINADOS
//-------------------------------------------------------------------------------------------------
function getUsers(req, res) {
    // Pasamos a una variable el id del usuario que esta logeado
    var identity_users_id = req.user.sub;
    // Inicializamos la pagina en uno
    var page = 1;
    // Si obtenemos por parametro un numero de pagina
    if (req.params.page) {
        page = req.params.page
    }
    var itemsPerPage = 4;
    // Lista todos los usuarios de la base de datos ordenandolos por id
    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({ message: 'Existe un error en la peticion' });
        // Si no existe usuarios para listar
        if (!users) return res.status(404).send({ mesagge: 'no hay usuarios disponibles' });
        // Obtenemos los usuarios registrados,el total de usuarios y la cantidad de paginas
        followUserIds(identity_users_id).then((value) => {
            return res.status(200).send({
                //devuelve la cantidad de usuarios 
                users,
                users_following: value.following,
                users_follow_me: value.followed,
                total,
                //devuelve la paginas
                pages: Math.ceil(total / itemsPerPage)
            });
        });
    });
}
//-----------------------------------------------
//FUNCION ASYNCRONA PARA OBTENER ESTADISTICAS 
//-----------------------------------------------
async function followUserIds(user_id) {
    try {
        // Buscamos dentro de follows la lista de usuarios que seguimos
        var following = await Follow.find({ "user": user_id }).select({ '_id': 0, '__v': 0, 'user': 0 }).exec()
            .then((follows) => { return follows; }).catch((err) => { return handleError(err) });
        // Buscamos dentro de follows la lista de usuarios que nos siguen
        var followed = await Follow.find({ "followed": user_id }).select({ '_id': 0, '__v': 0, 'followed': 0 }).exec()
            .then((follows) => { return follows; }).catch((err) => { return handleError(err) });

        //Procesar following Ids
        var following_clean = [];
        following.forEach((follow) => {
            following_clean.push(follow.followed);
        });
        //Procesar followed Ids
        var followed_clean = [];
        followed.forEach((follow) => {
            followed_clean.push(follow.user);
        });
        //devolvemos la lista de usuario que seguimos y que nos siguen
        return {
            following: following_clean,
            followed: followed_clean
        }
    } catch (e) {
        console.log(e);
    }
}

//-------------------------------------------------------------------------------------------------
//EDITAR DATOS EL USUARIO 
//-------------------------------------------------------------------------------------------------
function updateUser(req, res) {
    // Obtenemos el id del usuario logueado
    var userId = req.params.id;
    // Obtenermos los datos que van a ser actualizados
    var update = req.body;
    // borrar la propiedad password
    delete update.password;
    //corroborar si es el usuario registrado el que quiere actualizar datos
    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No tienes permisos para actualizar datos' });
    }
    //corroborar si mail y contraseña se encuentran en la base de datos
    User.find({
        $or: [
            { email: update.email.toLowerCase() },
            { nickname: update.nickname.toLowerCase() }
        ]
    }).exec((err, users) => {
        var userIsset = false;
        users.forEach((user) => {
            if (user && user._id != userId) userIsset = true;
        });
        //comprobamos si el usuario esta en uso
        if (userIsset) return res.status(404).send({ message: 'los datos ya estan en uso' });
        //busca al usuario por id 
        User.findByIdAndUpdate(userId, update, { new: true, useFindAndModify: false }, (err, userUpdated) => {
            //comprueba si hay error en la peticion
            if (err) return res.status(500).send({ message: 'Existe un error en la peticion' });
            //comprueba si no hay usuario en la peticion
            if (!userUpdated) return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
            //actualiza los datos del usuario
            return res.status(200).send({ user: userUpdated });
        });
    });
}
//-------------------------------------------------------------------------------------------------
//SUBIR ARCHIVOS DE IMAGENES/AVATAR DE USUARIO 
//-------------------------------------------------------------------------------------------------
function uploadImage(req, res) {
    //obtenenos el id del usuario
    var userId = req.params.id;
    //corroborar si es el usuario registrado el que quiere subir la imagen
    if (req.files) {
        //sacamos el path completo de la imagen que tratamos de subir
        var file_path = req.files.image.path;
        console.log(file_path);
        //cortamos el nombre del archivo que intentamos subir
        var file_split = file_path.split('\\');
        console.log(file_split);
        //cortamos el nombre completo del archivo
        var file_name = file_split[2];
        console.log(file_name);
        //cortamos la extension del archivo
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        console.log(file_ext);
        //permiso dl usuario para
        if (userId != req.user.sub) {
            return removeFilesOfUploads(res, file_path, 'No tienes permisos para actualizar datos');
        }
        //comprobar si el documento tiene una extension de archivo logueado
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jepg' || file_ext == 'gif') {
            // actualizar documento de usuario logueado
            User.findByIdAndUpdate(userId, { image: file_name }, { new: true, useFindAndModify: false },
                (err, userUpdated) => {
                    //comprueba si hay error en la peticion
                    if (err) return res.status(500).send({ message: 'Existe un error en la peticion' });
                    //comprueba si no hay usuario en la peticion
                    if (!userUpdated) return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
                    //actualiza los datos del usuario
                    return res.status(200).send({ user: userUpdated });
                });
        } else {
            return removeFilesOfUploads(res, file_path, 'extension no valida');
        }
    } else {
        return res.status(200).send({ mesagge: 'no se han subido archivos' });
    }
}
//-------------------------------------------------------------------------------------------------
// DEVOLVER DE IMAGEN DE USUARIO 
//-------------------------------------------------------------------------------------------------
function getImageFile(req, res) {
    // Obtenemos por parametro el nombre del la imagen
    var image_File = req.params.imageFile;
    // creamos la variable completa donde se ubica la imagen
    var path_file = './uploads/users/' + image_File;
    // utilizamos fs para buscar el archivo
    fs.exists(path_file, (exists) => {
        if (exists) {
            // respondemos con la imagen
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ mesagge: 'no existe la imagen' });
        }
    });
}
//-----------------------------------------------
// FUNCION LOCAL PARA ELIMINAR ARCHIVOS DEL CACHE
//-----------------------------------------------
function removeFilesOfUploads(res, file_path, mensage) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ mesagge: mensage });
    });
}
//-------------------------------------------------------------------------------------------------
//FUNCION LOCAL OBTENER CONTADORES
//-------------------------------------------------------------------------------------------------
function getCounters(req, res) {
    //obtener usuario registrado
    var userId = req.user.sub;
    if (req.params.id) {
        userId = req.params.id;
    }
    // obtener contadores
    getCountFollow(userId).then((value) => {
        return res.status(200).send(value);
    });
}
//-----------------------------------------------
// FUNCION ASYNCRONA PARA OBTENER LOS CONTADORES
//-----------------------------------------------
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
//-------------------------------------------------------------------------------------------------
// EXPORTS
//-------------------------------------------------------------------------------------------------
module.exports = {
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile,
    getCounters
}