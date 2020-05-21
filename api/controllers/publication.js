'use strict'
// ------------------------------------------------------------------------------------------------
// CONTROLADOR DE PUBLICACIONES
// ------------------------------------------------------------------------------------------------
// Importa el modulo path para manejar archivos
var path = require('path');
// Importa el modulo fs para manejar archivos
var fs = require('fs');
// Importa momment para manejar fechas
var moment = require('moment');
// ------------------------------------------------------------------------------------------------
// MODELOS
// ------------------------------------------------------------------------------------------------
var Publication = require('../models/Publication');
var Follow = require('../models/Follow');
//-------------------------------------------------------------------------------------------------
// GUARDAR PUBLICACIONES
//-------------------------------------------------------------------------------------------------
function savePublication(req, res) {
    // obtiene de la solicitud los datos del formulario de ingreso de publicacion
    var params = req.body;
    // comprueba si tiene completo el campo texto
    if (!params.text)
        // en caso de no ser correcto informa que debe ingresar publicacion
        return res.status(200).send({ mesagge: 'la publicacion debe tener texto' });
    // si todo es correcto creamos la varianle publicacion
    var publication = new Publication();
    // almacena en la variable publicacion todos los datos ingresados por el formulario
    publication.text = params.text;
    publication.file = 'null';
    publication.user = req.user.sub;
    publication.created_at = moment().unix();
    // intenta guardar la publicacion en la base de datos
    publication.save((err, publicationStored) => {
        // si exite un error en esta accion devuleve un CR 500 
        if (err)
            return res.status(500).send({ mesagge: 'error al guardar publicacion' });
        // si no pudo almacenar la publicacion en la base de datos envia un CR 404
        if (!publicationStored)
            return res.status(404).send({ mesagge: 'la publicacion no ha sido guardada' });
        // si el procedimeinto fue correcto envia un CR 200 y json con la publicacion almacenada
        return res.status(200).send({ publication: publicationStored });
    })
}
// ------------------------------------------------------------------------------------------------
// OBTENER PUBLICACIONES 
// ------------------------------------------------------------------------------------------------
function getPublications(req, res) {
    // declara la variable pagina con el valor 1 por defecto
    var page = 1;
    // obtiene de la solicitud el numero de pagina como parametro
    if (req.params.page) {
        page = req.params.page;
    }
    //declara la variable items por pagina y le asigna el valor 4 por defecto 
    var itemsPerPage = 4;
    //intenta buscar en la collecion follos la lista de seguidores
    Follow.find({ user: req.user.sub }).populate('followed').exec((err, follows) => {
        // si no pudo ejecutar la solicitud la accion envia un CR 500
        if (err)
            return res.status(500).send({ mesagge: 'error al devolver el seguimiento' });
        //  si es correcta la solicitud declara un varible de seguidores 
        var follows_clean = [];
        // llena esa variable seguidores con la lista de usuario que nos siguen
        follows.forEach((follow) => {
            follows_clean.push(follow.followed);
        });
        // agrega al lista de seguidres el id del usuario que inicio secion en la aplicacion
        follows_clean.push(req.user.sub);
        // intenta obtener de la base de datos la publicaciones de la lista de seguidores 
        Publication.find({ user: { "$in": follows_clean } }).sort('-created_at').populate('user')
            .paginate(page, itemsPerPage, (err, publications, total) => {
                // si se produce un error envia un CR 500
                if (err)
                    return res.status(500).send({ mesagge: 'error al devolver publicaciones' });
                // si no existe publiciones envia un CR 404
                if (!publications)
                    return res.status(404).send({ mesagge: 'no hay  publicaciones' });
                // si todo es correcto envia un CR 200 y un json con las publicaciones mas los sig
                return res.status(200).send({
                    // total de publicaciones
                    total_items: total,
                    // la lista de publicaciones
                    publications: publications,
                    // pagina actual
                    page: page,
                    // item por pagina
                    items_per_page: itemsPerPage,
                    // cantidad de paginas
                    pages: Math.ceil(total / itemsPerPage)
                });
            });
    });

}
// ------------------------------------------------------------------------------------------------
// OBTENER PUBLICACIONES DEL USUARIO 
// ------------------------------------------------------------------------------------------------
function getPublicationsUser(req, res) {
    // declara la variable pagina con el valor 1 por defecto
    var page = 1;
    // obtiene de la solicitud el numero de pagina como parametro   
    if (req.params.page) {
        page = req.params.page;
    }
    //obtener id del usuario que inicio sesion de la solicitud
    var user = req.user.sub;
    if (req.params.user) {
        user = req.params.user;
    }
    //declara la variable items por pagina y le asigna el valor 4 por defecto 
    var itemsPerPage = 4;
    // intenta obtener de la base de datos la publicaciones del usuario paginadas
    Publication.find({ user: user }).sort('-created_at').populate('user')
        .paginate(page, itemsPerPage, (err, publications, total) => {
            // si hubo un error en en la solicitud informa un CR 500
            if (err)
                return res.status(500).send({ mesagge: 'error al devolver publicaciones' });
            // si no hay publicaciones envia un CR 404
            if (!publications)
                return res.status(404).send({ mesagge: 'no hay  publicaciones' });
            // si la solitud es correcta envia un CR 200 y un json con la lista de publicaciones
            return res.status(200).send({
                // total de publicaciones
                total_items: total,
                // las publicaciones
                publications: publications,
                // paginas
                page: page,
                // items por pagina
                items_per_page: itemsPerPage,
                //total de paginas
                pages: Math.ceil(total / itemsPerPage)
            });
        });
}
// -------------------------------------------------------------------------------------------------
// OBTENER PUBLICACION
// -------------------------------------------------------------------------------------------------
function getPublication(req, res) {
    // obtiene del la solicitud el id de la publicacion
    var publicationId = req.params.id;
    //intenta obtener de la base de datos la publicacion soliciatda por id
    Publication.findById(publicationId, (err, publication) => {
        // si la solicictud es erronea envia un CR 500
        if (err)
            return res.status(500).send({ mesagge: 'error al devolver publicacion' });
        // si no se encuentra la publicacion envia un CR 404
        if (!publication)
            return res.status(404).send({ mesagge: 'no hay  publicacion' });
        // si fue correcta envia unCR 200 y un json con la publicacion
        return res.status(200).send({ publication });
    });
}
// ------------------------------------------------------------------------------------------------
// ELIMINAR UNA PUBLICACION
// ------------------------------------------------------------------------------------------------
function deletePublication(req, res) {
    // obtiene de la solicitud el id de la publicacion
    var publicationId = req.params.id;
    // intenta eliminar de la base de datos la publicacion por el id ingresado
    Publication.find({ 'user': req.user.sub, '_id': publicationId })
        .remove((err, publicationRemoved) => {
            // si la solitud es erronea envia un CR 500
            if (err)
                return res.status(500).send({ message: 'Error al borrar publicaciones' });
            // si no ecuentra la publicacion para eliminar envia un CR 404
            if (!publicationRemoved)
                return res.status(404).send({ message: 'No se ha borrado la publicacion ' });
            // si pudo eliminar la publicacion envia un CR 200
            if (publicationRemoved.n == 1) {
                return res.status(200).send({ message: 'Publicacion eliminada correctamente' });
                // pero si no la pudo borrar envia un CR 404
            } else {
                return res.status(404).send({ message: 'Error al borrar publicacion' });
            }

        });

}
// ------------------------------------------------------------------------------------------------
// SUBIR ARCHIVOS DE IMAGENES/AVATAR DE USUARIO 
// ------------------------------------------------------------------------------------------------
function uploadImage(req, res) {
    //obtenenos de la solicutu id de la publicacion
    var publicationId = req.params.id;
    //obtiene de la solitud el nombre del archivo
    if (req.files) {
        // obtenemos el path completo de la imagen que tratamos de subir
        var file_path = req.files.image.path;
        // individualizamos el nombre del archivo que intentamos subir
        var file_split = file_path.split('\\');
        // individualizamos el nombre completo del archivo
        var file_name = file_split[2];
        // individualizamos la extension del archivo
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        //comprobar si el archivo tiene una extension valida como archivo de imagen
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jepg' || file_ext == 'gif') {
            // intenta buscar en la coleccion publications del usuario la publicacion por el id de la publicación
            Publication.find({ 'user': req.user.sub, '_id': publicationId })
                .exec((err, publication) => {
                    // si encuentra la publicacion
                    if (publication) {
                        // intenta actualizar documento de la publicacion
                        Publication.findByIdAndUpdate(publicationId, { file: file_name },
                            { new: true }, (err, publicationUpdated) => {
                                // si hay un error en esta solicitud envia un CR 500
                                if (err)
                                    return res.status(500)
                                        .send({ message: 'Existe un error en la peticion' });
                                //si no encuentra la publicacion envia un CR 404
                                if (!publicationUpdated)
                                    return res.status(404)
                                        .send({
                                            message: 'No se ha podido actualizar la '
                                                + 'publicacion'
                                        });
                                // si encuentra la publicacion envia un CR 200
                                return res.status(200)
                                    .send({ publication: publicationUpdated });
                            });
                        // si no coincide los datos de id de usario con la publicacion 
                        // ejecuta la funcion removeFilesOfUploads y el mensaje ---
                    } else {
                        return removeFilesOfUploads(res, file_path, 'no tienes permiso para '
                            + 'actualizar la publicacion');
                    }
                });
            // si la extension del archivo no es valida como archivo de imagen 
            // ejecuta la funcion removeFilesOfUploads y el mensaje ---
        } else {
            return removeFilesOfUploads(res, file_path, 'extension no valida');
        }
    }
}
// ------------------------------------------------------------------------------------------------
// DEVOLVER IMAGEN DE PUBLICACION
// ------------------------------------------------------------------------------------------------
function getImageFile(req, res) {
    // obtiene de la solicitud el nombre de la imagen
    var image_File = req.params.imageFile;
    // crea la variable con el url de la ubicacion de la imagen
    var path_file = './uploads/publications/' + image_File;
    // utiliza fs para buscar la imagen en la caarpeta local donde se almacenan las imagenes
    fs.exists(path_file, (exists) => {
        // si encuentra la imagen envia la respuetsa con la url de la imagen 
        if (exists) {
            res.sendFile(path.resolve(path_file));
            // si no encuentra la imagen envia un CR200 con el mensaje no existe la imagen
        } else {
            res.status(200).send({ mesagge: 'no existe la imagen' });
        }
    });
}
//-------------------------------------------------------------------------------------------------
//FUNCION LOCAL PARA ELIMINAR ARCHIVOS DEL CACHE
//-------------------------------------------------------------------------------------------------
function removeFilesOfUploads(res, file_path, mensage) {
    // recibe por parametro la respuetsa, la extension del archivo y un mensaje
    // utiliza fs para eliminar el archivo que se intenta subir del chache
    fs.unlink(file_path, (err) => {
        // si pudo eliminarlo correctamente envia un CR 200 y el mensaje ingrsado
        return res.status(200).send({ mesagge: mensage });
    });
}
//------------------------------------------------------------------------------------------------
module.exports = {
    savePublication,
    getPublications,
    getPublicationsUser,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
}
//------------------------------------------------------------------------------------------------