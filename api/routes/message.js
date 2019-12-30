'use strict'

var express = require('express');
var MessageController = require('../controllers/message');
var api = express.Router();
var md_auth = require('..//middlewares/authenticated');

//-------------------------------------------------------------------------------------------------
//RUTAS PARA EXPORTAR
//-------------------------------------------------------------------------------------------------
api.get('/prueba-message',md_auth.ensureAuth,MessageController.pruebaMessage);

//-------------------------------------------------------------------------------------------------
//EXPORTS
//-------------------------------------------------------------------------------------------------
module.exports = api;
