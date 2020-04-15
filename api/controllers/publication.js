'use strict'
//-------------------------------------------------------------------------------------------------
//IMPORTS
//-------------------------------------------------------------------------------------------------
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');
//-------------------------------------------------------------------------------------------------
//MODELS
//-------------------------------------------------------------------------------------------------
var Publication = require('../models/Publication');
var User = require('../models/User');
var Follow = require('../models/Follow');
//-------------------------------------------------------------------------------------------------
// METODO DE PRUEBA
//-------------------------------------------------------------------------------------------------
function prueba(req, res) {
    res.status(200).send({ message: 'mensje de prueba desde el controlador de publicaciones' });
}
//-------------------------------------------------------------------------------------------------
// GUARDAR PUBLICACIONES
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
        //agregamos nuestras publicaciones al timweline
        follows_clean.push(req.user.sub);
        //usamos el operador $in para buscar dentro de una coleccion coincidencias
        Publication.find({ user: { "$in": follows_clean } }).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {

            if (err) return res.status(500).send({ mesagge: 'error al devolver publicaciones' });

            if (!publications) return res.status(404).send({ mesagge: 'no hay  publicaciones' });

            return res.status(200).send({
                total_items: total,
                publications: publications,
                page: page,
                items_per_page: itemsPerPage,
                pages: Math.ceil(total / itemsPerPage)
            });
        });
    });

}
// -------------------------------------------------------------------------------------------------
// OBTENER PUBLICACION
// -------------------------------------------------------------------------------------------------
function getPublication(req, res) {
    var publicationId = req.params.id;

    Publication.findById(publicationId, (err, publication) => {

        if (err) return res.status(500).send({ mesagge: 'error al devolver publicacion' });

        if (!publication) return res.status(404).send({ mesagge: 'no hay  publicacion' });

        return res.status(200).send({ publication });
    });

}
//-------------------------------------------------------------------------------------------------
//ELIMINAR UNA PUBLICACION
//-------------------------------------------------------------------------------------------------
function deletePublication(req, res) {
    var publicationId = req.params.id;

    Publication.find({ 'user': req.user.sub, '_id': publicationId })
        .remove((err, publicationRemoved) => {
            if (err) return res.status(500).send({ message: 'Error al borrar publicaciones' });
            if (!publicationRemoved) return res.status(404).send({ message: 'No se ha borrado la publicacion ' });

            if (publicationRemoved.n == 1) {
                return res.status(200).send({ message: 'Publicacion eliminada correctamente' });
            } else {
                return res.status(404).send({ message: 'Error al borrar publicacion' });
            }

        });

}
//-------------------------------------------------------------------------------------------------
//SUBIR ARCHIVOS DE IMAGENES/AVATAR DE USUARIO - /uploadImage
//-------------------------------------------------------------------------------------------------
function uploadImage(req, res) {
    //obtenenos el id del usuario
    var PublicationId = req.params.id;
    //corroborar si es el usuario registrado el que quiere subir la imagen
    if (req.files) {
        //sacamos el path completo de la imagen que tratamos de subir
        var file_path = req.files.image.path;
        //cortamos el nombre del archivo que intentamos subir
        var file_split = file_path.split('\\');
        //cortamos el nombre completo del archivo
        var file_name = file_split[2];
        //cortamos la extension del archivo
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        //comprobar si el documento tiene una extension de archivo logueado
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jepg' || file_ext == 'gif') {

            Publication.findOne({ 'user': req.user.sub, '_id': PublicationId }).exec((err, publication) => {
                if (publication) {
                    // actualizar documento de la publicacion
                    Publication.findByIdAndUpdate(PublicationId, { file: file_name }, (err, publicationUpdated) => {
                        //comprueba si hay error en la peticion
                        if (err) return res.status(500).send({ message: 'Existe un error en la peticion' });
                        //comprueba si no hay usuario en la peticion
                        if (!publicationUpdated) return res.status(404).send({ message: 'No se ha podido actualizar la publicacion' });
                        //actualiza los datos del usuario
                        return res.status(200).send({ publication: publicationUpdated });
                    });
                } else {
                    return removeFilesOfUploads(res, file_path, 'no tienes permiso para actualizar la publicacion');
                }
            });
        } else {
            return removeFilesOfUploads(res, file_path, 'extension no valida');
        }
    } else {
        return res.status(200).send({ mesagge: 'no se han subido archivos' });
    }
}
//-------------------------------------------------------------------------------------------------
//DEVOLVER DE IMAGEN DE USUARIO - /get-Image-file/imageFile
//-------------------------------------------------------------------------------------------------
function getImageFile(req, res) {
    var image_File = req.params.imageFile;

    var path_file = './uploads/publications/' + image_File;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ mesagge: 'no existe la imagen' });
        }
    });
}
//-------------------------------------------------------------------------------------------------
//FUNCION LOCAL PARA ELIMINAR ARCHIVOS DEL CACHE
//-------------------------------------------------------------------------------------------------
function removeFilesOfUploads(res, file_path, mensage) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ mesagge: mensage });
    });
}

//-------------------------------------------------------------------------------------------------
//EXPORTS
//-------------------------------------------------------------------------------------------------
module.exports = {
    prueba,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
}