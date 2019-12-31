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
// configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});
//-----------------------------------------------------------------------------------------
//CREACION DE LAS RUTAS
//-----------------------------------------------------------------------------------------
app.use('/api',user_routes);
app.use('/api',follow_routes);
app.use('/api',publication_routes);
app.use('/api',message_routes);

module.exports = app;