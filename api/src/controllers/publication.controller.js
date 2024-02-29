'use strict'

import path from 'path';
import fs from 'fs';
import moment from 'moment';
import mongodb from 'mongodb';

import Publication from '../models/publication.model.js';
import Follow from '../models/follow.model.js';

const { ObjectId } = mongodb;


export const savePublication = async(req, res) => {

    try {

    const params = req.body;

    if (!params.text)

        return res.status(200).send({ mesagge: 'la publicacion debe tener texto' });

    const publication = new Publication(
        params.text,
        null,
        req.user.sub,
        moment().unix(),
    );

    const existingUser = await getDatabase().collection('publications').findOne({_id: new ObjectId(userId)  });


     publication.save((err, publicationStored) => {

        if (err)
            return res.status(500).send({ mesagge: 'error al guardar publicacion' });

        if (!publicationStored)
            return res.status(404).send({ mesagge: 'la publicacion no ha sido guardada' });

        return res.status(200).send({ publication: publicationStored });
    })
    } catch (error) {

        return res.status(500).send({ mesagge: 'error al guardar publicacion' });
    }
}

export function getPublications(req, res) {

    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Follow.find({ user: req.user.sub }).populate('followed').exec((err, follows) => {

        if (err)
            return res.status(500).send({ mesagge: 'error al devolver el seguimiento' });

        var follows_clean = [];

        follows.forEach((follow) => {
            follows_clean.push(follow.followed);
        });

        follows_clean.push(req.user.sub);
 
        Publication.find({ user: { "$in": follows_clean } }).sort('-created_at').populate('user')
            .paginate(page, itemsPerPage, (err, publications, total) => {

                if (err)
                    return res.status(500).send({ mesagge: 'error al devolver publicaciones' });

                if (!publications)
                    return res.status(404).send({ mesagge: 'no hay  publicaciones' });

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

export function getPublicationsUser(req, res) {

    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var user = req.user.sub;
    if (req.params.user) {
        user = req.params.user;
    }

    var itemsPerPage = 4;

    Publication.find({ user: user }).sort('-created_at').populate('user')
        .paginate(page, itemsPerPage, (err, publications, total) => {

            if (err)
                return res.status(500).send({ mesagge: 'error al devolver publicaciones' });

            if (!publications)
                return res.status(404).send({ mesagge: 'no hay  publicaciones' });

            return res.status(200).send({

                total_items: total,
                publications: publications,
                page: page,
                items_per_page: itemsPerPage,
                pages: Math.ceil(total / itemsPerPage)
            });
        });
}

export function getPublication(req, res) {

    var publicationId = req.params.id;

    Publication.findById(publicationId, (err, publication) => {

        if (err)
            return res.status(500).send({ mesagge: 'error al devolver publicacion' });

        if (!publication)
            return res.status(404).send({ mesagge: 'no hay  publicacion' });

        return res.status(200).send({ publication });
    });
}

export function deletePublication(req, res) {

    var publicationId = req.params.id;

    Publication.find({ 'user': req.user.sub, '_id': publicationId })
        .remove((err, publicationRemoved) => {

            if (err)
                return res.status(500).send({ message: 'Error al borrar publicaciones' });

            if (!publicationRemoved)
                return res.status(404).send({ message: 'No se ha borrado la publicacion ' });

            if (publicationRemoved.n == 1) {
                return res.status(200).send({ message: 'Publicacion eliminada correctamente' });

            } else {
                return res.status(404).send({ message: 'Error al borrar publicacion' });
            }

        });

}

export function uploadImage(req, res) {

    var publicationId = req.params.id;

    if (req.files) {

        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jepg' || file_ext == 'gif') {

            Publication.find({ 'user': req.user.sub, '_id': publicationId })
                .exec((err, publication) => {
                   
                    if (publication) {
                        
                        Publication.findByIdAndUpdate(publicationId, { file: file_name },
                            { new: true }, (err, publicationUpdated) => {
                                
                                if (err)
                                    return res.status(500)
                                        .send({ message: 'Existe un error en la peticion' });

                                if (!publicationUpdated)
                                    return res.status(404)
                                        .send({
                                            message: 'No se ha podido actualizar la '
                                                + 'publicacion'
                                        });

                                return res.status(200)
                                    .send({ publication: publicationUpdated });
                            });

                    } else {
                        return removeFilesOfUploads(res, file_path, 'no tienes permiso para '
                            + 'actualizar la publicacion');
                    }
                });

        } else {
            return removeFilesOfUploads(res, file_path, 'extension no valida');
        }
    }
}

export function getImageFile(req, res) {

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

export function removeFilesOfUploads(res, file_path, mensage) {

    fs.unlink(file_path, (err) => {

        return res.status(200).send({ mesagge: mensage });
    });
}

export default {
    savePublication,
    getPublications,
    getPublicationsUser,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
}
