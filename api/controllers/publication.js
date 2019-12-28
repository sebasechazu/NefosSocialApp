'use strict'
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require ('mongoose-pagination');

var Publication = require('../models/Publication');
var User = require('../models/User');
var Follow = require('../models/Follow');

function prueba(req,res) {
    res.status(200).send({message:'mensje de prueba desde el controlador de publicaciones' });
    
}
//-------------------------------------------------------------------------------------------------
//GUARDAR PUBLICACIONES
//-------------------------------------------------------------------------------------------------
function savePublication(req,res) {
    var params = req.body;
    //comprobamos si la publicacion tiene u texto
    if (!params.text) return res.status(200).send({mesagge: 'la publicacion debe tener texto'});
    //creamos una publicacion
    var publication = new Publication();

    publication.text = params.text;
    publication.file = 'null';
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    publication.save((err,publicationStored)=>{
        if (err) return res.status(500).send({mesagge: 'error al guardar publicacion'});

        if (!publicationStored) return res.status(404).send({mesagge: 'la publicacion no ha sido guardada'});

        return res.status(200).send({publication : publicationStored});
    })


}
//-------------------------------------------------------------------------------------------------
//EXPORTS
//-------------------------------------------------------------------------------------------------
module.exports = {
    prueba,
    savePublication
}