'use strict'
/// ------------------------------------------------------------------------------------------------
// ROUTING DEL CONTROLADOR DE USUARIO
// ------------------------------------------------------------------------------------------------
// Creamos el servidor
var express = require('express');
// importamos El controlador de mensajes
var MessageController = require('../../controllers/message');
// Creamos la variable de roint de exppres
var api = express.Router();
// importamos el middleware de autenticacion 
var md_auth = require('../middlewares/authenticated');
// -------------------------------------------------------------------------------------------------
// RUTAS PARA EXPORTAR
// -------------------------------------------------------s------------------------------------------
api.post('/message', md_auth.ensureAuth, MessageController.saveMessage);
api.get('/my-messages/:page?', md_auth.ensureAuth, MessageController.getReceivedMessages);
api.get('/messages/:page?', md_auth.ensureAuth, MessageController.getEmmitMessages);
api.get('/unviewed-messages', md_auth.ensureAuth, MessageController.getUnviewedMessages);
api.get('/set-viewed-messages', md_auth.ensureAuth, MessageController.setViewedMessages);
// -------------------------------------------------------------------------------------------------
module.exports = api;
// -------------------------------------------------------------------------------------------------