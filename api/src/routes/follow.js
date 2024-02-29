'use strict'
// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------
// Importa expres para crear el servidor
var express = require('express');
// Importa el controlador de follow
var FollowController = require('../../controllers/follow');
// Crea la variable api para 
var api = express.Router();
// importa el middleware de autenticacion
var md_auth = require('../middlewares/authenticated');
// ------------------------------------------------------------------------------------------------
// RUTAS
// ------------------------------------------------------------------------------------------------
api.post('/follow', md_auth.ensureAuth, FollowController.saveFollow);
api.delete('/follow/:id', md_auth.ensureAuth, FollowController.deleteFollow);
api.get('/following/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowingUsers);
api.get('/followed/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowedUser);
api.get('/get-my-follows/:followed?', md_auth.ensureAuth, FollowController.getMyFollows);
// ------------------------------------------------------------------------------------------------
module.exports = api;
// ------------------------------------------------------------------------------------------------
