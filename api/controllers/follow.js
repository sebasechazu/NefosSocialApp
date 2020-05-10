'use strict'
// ------------------------------------------------------------------------------------------------
// CONTROLADOR DE FOLLOWS
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// MODELO
// ------------------------------------------------------------------------------------------------
var Follow = require('../models/Follow');
// ------------------------------------------------------------------------------------------------
// SEGUIR A UN USUARIO 
// ------------------------------------------------------------------------------------------------
function saveFollow(req, res) {
    // Obtiene de la solitiud datos de un formulario
    var params = req.body;
    // Declara una variable follow como un objeto de follow
    var follow = new Follow();
    // almacena en la varible follow losdatos recibidos de la solitud 
    // usuario que inicio sesion en la apliccion
    follow.user = req.user.sub;
    // usuario que se desea seguir
    follow.followed = params.followed;
    // intenta guardar en la coleccion follow el nuevo follow
    follow.save((err, followStored) => {
        // Si no pudo procesar la solicitud envia un CR 500
        if (err)
            return res.status(500).send({ mesagge: 'error al guardar el seguimiento' });
        // Si no existe un follow para guardar envia un CR 404  
        if (!followStored)
            return res.status(404).send({ mesagge: 'el seguimiento no se a guardado' });
        // Si la solicitud se proceso correctamente envia un CR 200y un json con el follow
        return res.status(200).send({ follow: followStored });
    });
}
// ------------------------------------------------------------------------------------------------
// DEJAR DE SEGUIR A UN USUARIO
// ------------------------------------------------------------------------------------------------
function deleteFollow(req, res) {
    // obtiene de la solicutd el id del usuario que inicio sesion en la aplicacion
    var userId = req.user.sub;
    // obtiene por parametro el id del usuario que se desea dejar de seguir
    var followId = req.params.id;
    // intenta eliminar de la collecion follows el follows indicado por los datos ingresados
    Follow.findOneAndDelete({
        'user': userId,
        'followed': followId
    }, (err, seguimientoEliminado) => {
        // si existe un error en la solicitud envia un CR 500
        if (err) {
            return res.status(500).send({
                mesagge: 'error al eliminar el seguimiento'
            });
        }
        // si la solicitud se proceso correctamente se envia un CR 200
        return res.status(200).send({ message: 'el seguimiento se ha eliminado correctamente' });
    });
}
// -------------------------------------------------------------------------------------------------
// LISTA DE SEGUIDOS 
// -------------------------------------------------------------------------------------------------
function getFollowingUsers(req, res) {
    //obtenemos de la solicitud como parametro el id de un usuario 
    var userId = req.user.sub;
    // si no recibe un id de usuario utiliza el id del usuario que inicio sesion en la aplicacion.
    if (req.params.id) {
        userId = req.params.id;
    }
    // crea la variable pagina y la inicializa en 1
    var page = 1;
    //comprueba si ingresamos un numero de pagina como parametro
    if (req.params.page) {
        page = req.params.page;
    }
    // crea la variable item por pagina y la inicaliza en 4
    var itemsPerPage = 4;
    // intenta obtener de la coleccion follows un array de follows con el followed igual al id ingresado
    Follow.find({ user: userId }).populate({ path: 'followed' })
        .paginate(page, itemsPerPage, (err, follows, total) => {
            // si la solicitud no pudo ser procesada envia un CR 500
            if (err)
                return res.status(500).send({ mesagge: 'la solicitud no pude ser procesada' });
            // si el array esta vacio envia un codigo de respuesta 404 
            if (!follows)
                return res.status(404).send({ mesagge: 'no esta siguiendo a ningun usuario' });
            // si pudo precesar correctamete ejecuta la funcion followUsrIds
            // y envia un CR 200 con los datos
            followUserIds(req.user.sub).then((value) => {
                return res.status(200).send({
                    // total de follows
                    total: total,
                    // cantidad de paginas
                    pages: Math.ceil(total / itemsPerPage),
                    // los follows
                    follows,
                    // cantidad de seguidores y cantidad de seguidos
                    users_following: value.following,
                    users_follow_me: value.followed,
                });
            });
        });
}
// ------------------------------------------------------------------------------------------------
// LISTA DE SEGUIDORES
// ------------------------------------------------------------------------------------------------
function getFollowedUser(req, res) {
    //obtenemos de la solicitud el id de un usuario por parametro
    var userId = req.user.suneb;
    // si no obtubo un id itilisa el id de usuario que inicio sesion en la aplicacion
    if (req.params.id) {
        userId = req.params.id;
    }
    // crea la variable pagina y la inicializa en 1
    var page = 1;
    // si recibe como parametro un numero de pagina la almacena en la varibale pagina
    if (req.params.page) {
        page = req.params.page;
    }
    // crea una variable item por pagina y la inicializa en 4
    var itemsPerPage = 4;
    // intenta buscar en la coleccion follow la lista de follows por userid
    Follow.find({ followed: userId }).populate('user')
        .paginate(page, itemsPerPage, (err, follows, total) => {
            // si no pudo prcesar correctamente la la solititud envia un CR 500
            if (err)
                return res.status(500).send({ mesagge: 'error en el servidor' });
            //si no ecuentra a ningun seguidor un CR 404
            if (!follows)
                return res.status(404).send({ mesagge: 'no te sigue ningun usuario' });
            // si pudo procesar correctamente la solicitud ejecuta la funcion sollowuserid()
            followUserIds(req.user.sub).then((value) => {
                // devuve la funcion con un CR 200 y los datos que devuelve la funcion 
                return res.status(200).send({
                    total: total,
                    pages: Math.ceil(total / itemsPerPage),
                    follows,
                    users_following: value.following,
                    users_follow_me: value.followed,
                });
            });
        });
}
// ------------------------------------------------------------------------------------------------
// OBTENER SEGUIMIENTOS
// ------------------------------------------------------------------------------------------------
function getMyFollows(req, res) {
    // Obtenemos de la solicitud por parametro el id de un usuario
    var userId = req.user.sub;
    // crea la variable busqueda que busca los id de usuario por seguidores buscando en la collecion
    // follow
    var find = Follow.find({ user: userId });
    // comprueba recibe por paramtro un usaurio seguido buscando el la collecion follow 
    if (req.params.followed) {
        find = Follow.find({ followed: userId });
    }
    // intenta crear un array con los datos de la busqueda
    find.populate('user followed').exec((err, follows) => {
        // si no pudo procesar la solicitud envia un CR 500
        if (err) return res.status(500)
            .send({ mesagge: 'error en el servidor' });
        // si no encuentra a ningun seguidor envia un CR 404
        if (!follows)
            return res.status(404).send({ mesagge: 'no esta siguiendo a ningun usuario' });
        //si pudo procesar correctamente la respuesta envia un json con los seguidores
        return res.status(200).send({ follows });
    });
}
// ----------------------------------------------
// OBTENER LOS RESULTADOS DE FOLLOWING 
// ----------------------------------------------
async function followUserIds(user_id) {
    // recibe como parametro el id de usuario
    try {
        // crea una varibale followwing que busca en la base de datos los follows
        // del usuario ingresado por user 
        var following = await Follow.find({ "user": user_id })
            .select({ '_id': 0, '__v': 0, 'user': 0 }).exec()
            .then((follows) => { return follows; })
            .catch((err) => { return handleError(err) });
        // crea una varibale followed que busca en la base de datos los follows
        // del usuario ingresado por followed 
        var followed = await Follow.find({ "followed": user_id })
            .select({ '_id': 0, '__v': 0, 'followed': 0 }).exec()
            .then((follows) => { return follows; })
            .catch((err) => { return handleError(err) });

        //Procesar following como un array de follos
        var following_clean = [];
        following.forEach((follow) => {
            following_clean.push(follow.followed);
        });
        //Procesar followed como un array de followed
        var followed_clean = [];
        followed.forEach((follow) => {
            followed_clean.push(follow.user);
        });
        // devvuelve un array con lista de seguidores y seguidos
        return {
            following: following_clean,
            followed: followed_clean
        }
    } catch (e) {
        console.log(e);
    }
}
//------------------------------------------------------------------------------------------------
module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUser,
    getMyFollows
}
//------------------------------------------------------------------------------------------------