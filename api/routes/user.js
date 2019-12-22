'use strict'
//servidor
var express = require('express');
//controlador
var UserController = require('../controllers/user');
//creacion de la api
var api = express.Router();
//middleware de autenticacion
var md_auth = require('../middlewares/authenticated');
//middleware de subida de imagenes
var multipart = require('connect-multiparty');
var md_upload =  multipart({uploadDir: './uploads/users'});



api.get('/home', UserController.home);

api.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);

api.post('/register', UserController.saveUser);

api.post('/login', UserController.loginUser);

api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);

api.get('/users/:page?',md_auth.ensureAuth, UserController.getUsers ); 

api.put('/update-user/:id',md_auth.ensureAuth,UserController.updateUser);

api.post('/upload-image-user/:id',[md_auth.ensureAuth,md_upload],UserController.uploadImage);

module.exports = api;