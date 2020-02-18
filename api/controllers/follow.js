'use strict'
// variables
var mongoseePaginate = require('mongoose-pagination');

var User = require('../models/User');
var Follow = require('../models/Follow');

function prueba(req, res) {
    res.status(200).send({ mesagge: 'metodo de prueba desde el controlador follow' });
}
//-------------------------------------------------------------------------------------------------
//SEGUIR A UN USUARIO /saveFollow
//-------------------------------------------------------------------------------------------------
function saveFollow(req, res) {
    var params = req.body;
    //creo una instacia de seguimiento
    var follow = new Follow();
    follow.user = req.user.sub;
    follow.followed = params.followed;
    //guardamos el seguimiento
    follow.save((err, followStored) => {
        if (err) return res.status(500).send({ mesagge: 'error al guardar el seguimiento' });
        if (!followStored) return res.status(404).send({ mesagge: 'el seguimiento no se a guardado' });
        //retornamos el seguimiento
        return res.status(200).send({ follow: followStored });
    });
}
//-------------------------------------------------------------------------------------------------
//DEJAR DE SEGUIR A UN USUARIO /deleteFollow
//-------------------------------------------------------------------------------------------------
function deleteFollow(req, res) {
    var userId = req.user.sub;
    var followId = req.params.id;

    Follow.findOneAndDelete({
        'user': userId,
        'followed': followId
    }, (err, seguimientoEliminado) => {
        if (err) {
            return res.status(500).send({
                mesagge: 'error al dejar de seguir'
            });
        }

        return res.status(200).send({ message: 'el follow se ha eliminado!!!' });

    });
}

// -------------------------------------------------------------------------------------------------
// LISTA DE SEGUIDOS /following/:id?/:page?
// -------------------------------------------------------------------------------------------------
function getFollowingUsers(req, res) {
    //obtenemos el datos del usuario logueado
    var userId = req.user.sub;
    //comprueba si ingresamos id
    if (req.params.id) {
        userId = req.params.id;
    }
    var page = 1;
    //comprueba si ingresamos page
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 4;
    //buscamos las listas de usuarios que estamos siguiendo y con populate cambiamos 
    Follow.find({ user: userId }).populate({ path: 'followed' })
        .paginate(page, itemsPerPage, (err, follows, total) => {

            if (err) return res.status(500).send({ mesagge: 'error en el servidor' });

            if (!follows) return res.status(404).send({ mesagge: 'no esta siguiendo a ningun usuario' });

            return res.status(200).send({
                total: total,
                pages: Math.ceil(total / itemsPerPage),
                follows
            });
        });
}
// -------------------------------------------------------------------------------------------------
// LISTA DE SEGUIDORES following/:id?/:page?
// -------------------------------------------------------------------------------------------------
function getFollowedUser(req, res) {
    //obtenemos el datos del usuario logueado
    var userId = req.user.sub;
    //comprueba si ingresamos id
    if (req.params.id) {
        userId = req.params.id;
    }
    var page = 1;
    //comprueba si ingresamos page
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 4;
    //buscamos las listas de usuarios que estamos siguiendo y con populate cambiamos 
    Follow.find({ followed: userId }).populate('user')
        .paginate(page, itemsPerPage, (err, follows, total) => {

            if (err) return res.status(500).send({ mesagge: 'error en el servidor' });

            if (!follows) return res.status(404).send({ mesagge: 'no te sigue ningun usuario' });

            return res.status(200).send({
                total: total,
                pages: Math.ceil(total / itemsPerPage),
                follows
            });
        });

}
//-------------------------------------------------------------------------------------------------
//DEVOLVER USUARIOS QUE SIGO Y QUE ME SIGEN
//-------------------------------------------------------------------------------------------------
function getMyFollows(req, res) {
    //obtenemos el datos del usuario logueado
    var userId = req.user.sub;

    var find = Follow.find({ user: userId });

    if (req.params.followed) {
        find = Follow.find({ followed: userId });

    }

    find.populate('user followed').exec((err, follows) => {

        if (err) return res.status(500).send({ mesagge: 'error en el servidor' });

        if (!follows) return res.status(404).send({ mesagge: 'no esta siguiendo a ningun usuario' });

        return res.status(200).send({ follows });
    });

}

//------------------------------------------------------------------------------------------------
//EXPORTS
//------------------------------------------------------------------------------------------------
module.exports = {
    prueba,
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUser,
    getMyFollows


}