'use strict'

var express = require('express');
var PublicationController = require('../controllers/publication');
var api = express.Router();
var md_auth = require('..//middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/publications'});

api.get('/prueba-publication',md_auth.ensureAuth,PublicationController.prueba);
api.post('/publication',md_auth.ensureAuth,PublicationController.savePublication);



module.exports = api;


