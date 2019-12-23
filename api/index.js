'use strict'
//-----------------------------------------------------------------------------------------
//ARCHIVO DE CRACION DEL API
//-----------------------------------------------------------------------------------------
var mongoose = require('mongoose');

var app= require('./app');

var port = 3800;

mongoose.Promise = global.Promise;

//conexion a la base de datos
mongoose.connect('mongodb://localhost:27017/NefosSocialDb',{useNewUrlParser: true,useUnifiedTopology: true})
    .then(()=> {
        console.log("la conexion a la base de datos NEFOSSOCIALAPP se realizo con exito");

        // crear servidor

        app.listen(port,()=> {
            console.log("servidor corriendo http://localhost:3800");
        })
    })
    .catch(err => console.log(err));