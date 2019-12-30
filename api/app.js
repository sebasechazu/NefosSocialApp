'use strict'
//-----------------------------------------------------------------------------------------
//ARCHIVO DE CONFIGURACION DE EXPRESS
//-----------------------------------------------------------------------------------------
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
//-----------------------------------------------------------------------------------------
//INSTANCIACION DE LA RUTAS
//-----------------------------------------------------------------------------------------
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/Publication');
var message_routes = require('./routes/message');
//-----------------------------------------------------------------------------------------
//MIDDLEWARES
//-----------------------------------------------------------------------------------------
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//-----------------------------------------------------------------------------------------
//cors
//-----------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------
//CREACION DE LAS RUTAS
//-----------------------------------------------------------------------------------------
app.use('/api',user_routes);
app.use('/api',follow_routes);
app.use('/api',publication_routes);
app.use('/api',message_routes);

module.exports = app;