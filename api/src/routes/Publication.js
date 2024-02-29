'use strict'
// ------------------------------------------------------------------------------------------------
// IMPORTS
// -----------------------------------------------------------------------------------------------
// Importa expres para crear las rutas
var express = require('express');
// Importa el controlador de publicaciones
var PublicationController = require('../../controllers/publication');
// Crea la variable api para administrar las rutas con express
var api = express.Router();
// Importa el middleware de autentificacion 
var md_auth = require('../middlewares/authenticated');
// Importa multiparty para el manejo de archivos
var multipart = require('connect-multiparty');
// Crea la variable donde informa la ubicacion de la carpetas de archivos
var md_upload = multipart({uploadDir:'./uploads/publications'});
//  -------------------------------------------------------------------------------------------------
// RUTAS 
// -------------------------------------------------------------------------------------------------
api.post('/publication',md_auth.ensureAuth,PublicationController.savePublication);
api.get('/publications/:page?',md_auth.ensureAuth,PublicationController.getPublications);
api.get('/publications-user/:user/:page?',md_auth.ensureAuth,PublicationController.getPublicationsUser);
api.get('/publication/:id',md_auth.ensureAuth,PublicationController.getPublication);
api.delete('/publication/:id',md_auth.ensureAuth,PublicationController.deletePublication);
api.post('/upload-img-pub/:id',[md_auth.ensureAuth,md_upload],PublicationController.uploadImage);
api.get('/get-image-pub/:imageFile',PublicationController.getImageFile);
// -------------------------------------------------------------------------------------------------
module.exports = api;
// -------------------------------------------------------------------------------------------------