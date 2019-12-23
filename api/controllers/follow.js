'use strict'
// variables
//var path = require('path');
//var  fs = require('fs');
var mongoseePaginate = require('mongoose-pagination');

var User = require('../models/User');
var Follow = require('../models/Follow');

function prueba(req, res) {
    res.status(200).send({ mesagge: 'metodo de prueba desde el controlador follow' });
}
//--------------------------------------------------------------------------------------------
//SEGUIR A UN USUARIO /saveFollow
//--------------------------------------------------------------------------------------------
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
//--------------------------------------------------------------------------------------------
//DEJAR DE SEGUIR A UN USUARIO /deleteFollow
//--------------------------------------------------------------------------------------------
function deleteFollow(req,res) {
    var userId = req.user.sub;
    var followId = req.params.id;

    Follow.find({'user':userId,'followed':followId}).remove(err =>{
        if (err) return res.status(500).send({ mesagge: 'error al dejar de seguir' });

        return res.status(200).send({message:'el follow se ha eliminado!!!'})
    })   
}
function getFollowingUsers(req,res) {
    var userId = req.user.sub;
    
    if (req.params.id) {
        userId = req.params.id;       
    }

    var page = 1;

    if (req.params.page) {
        page = req.params.page;
        
    }

    var itemsPerPage = 4;
    
}


//--------------------------------------------------------------------------------------------
//EXPORTS
//--------------------------------------------------------------------------------------------
module.exports = {
    prueba,
    saveFollow,
    deleteFollow

}