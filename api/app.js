'use strict'
// ------------------------------------------------------------------------------------------------
// ARCHIVO DE CONFIGURACION DE LA APLICACION
// ------------------------------------------------------------------------------------------------
// importamos el modulo expreess
var express = require('express');
// importamos el modulo body-parser
var bodyParser = require('body-parser');
// creamos una instancia de exprees
var app = express();
// ------------------------------------------------------------------------------------------------
// RUTAS
// ------------------------------------------------------------------------------------------------
// creamos una variable por cada ruta que tenga la aplicacion
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/Publication');
var message_routes = require('./routes/message');
// ------------------------------------------------------------------------------------------------
// MIDDLEWARES
// ------------------------------------------------------------------------------------------------
// instanciamos los midlaware 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// ------------------------------------------------------------------------------------------------
// CORS
// ------------------------------------------------------------------------------------------------
// configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With'
        + ', Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
// ------------------------------------------------------------------------------------------------
// CREACION DE LAS RUTAS
// ------------------------------------------------------------------------------------------------
// anexamos a la variable app las rutas 
app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', publication_routes);
app.use('/api', message_routes);
// Exportamos la variable app
module.exports = app;
// ------------------------------------------------------------------------------------------------