'use strict'
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Publication = require('../models/Publication');
var User = require('../models/User');
var Follow = require('../models/Follow');

function prueba(req, res) {
    res.status(200).send({ message: 'mensje de prueba desde el controlador de publicaciones' });

}
//-------------------------------------------------------------------------------------------------
//GUARDAR PUBLICACIONES
//-------------------------------------------------------------------------------------------------
function savePublication(req, res) {
    var params = req.body;
    //comprobamos si la publicacion tiene u texto
    if (!params.text) return res.status(200).send({ mesagge: 'la publicacion debe tener texto' });
    //creamos una publicacion
    var publication = new Publication();

    publication.text = params.text;
    publication.file = 'null';
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    publication.save((err, publicationStored) => {
        if (err) return res.status(500).send({ mesagge: 'error al guardar publicacion' });

        if (!publicationStored) return res.status(404).send({ mesagge: 'la publicacion no ha sido guardada' });

        return res.status(200).send({ publication: publicationStored });
    })
}
//-------------------------------------------------------------------------------------------------
//OBTENER PUBLICACIONES DE LOS USUARIOS QUE YO SIGO
//-------------------------------------------------------------------------------------------------
function getPublications(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 4;
    Follow.find({ user: req.user.sub }).populate('followed').exec((err, follows) => {
        if (err) return res.status(500).send({ mesagge: 'error al devolver el seguimiento' });
        var follows_clean = [];
        follows.forEach((follow) => {
            follows_clean.push(follow.followed);
        });
        //usamos el operador $in para buscar dentro de una coleccion coincidencias
        Publication.find({ user: { "$in": follows_clean } }).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
            
            if (err) return res.status(500).send({ mesagge: 'error al devolver publicaciones' });
            
            if (!publications) return res.status(404).send({ mesagge: 'no hay  publicaciones' });
            
            return res.status(200).send({
                total_items: total,
                publications: publications,
                page: page,
                pages: Math.ceil(total / itemsPerPage)
            });
        });
    });

}
//-------------------------------------------------------------------------------------------------
//OBTENER PUBLICACION
//-------------------------------------------------------------------------------------------------
function getPublication(req, res) {
    var publicationId = req.params.id;

    Publication.findById(publicationId,(err,publication)=>{

        if (err) return res.status(500).send({ mesagge: 'error al devolver publicacion' });

        if (!publication) return res.status(404).send({ mesagge: 'no hay  publicacion' });

        return res.status(200).send({publication});
    });

}
//-------------------------------------------------------------------------------------------------
//EXPORTS
//-------------------------------------------------------------------------------------------------
module.exports = {
    prueba,
    savePublication,
    getPublications,
    getPublication
}