'use strict'
//-----------------------------------------------------------------------------------------
//ARCHIVO DE CREACION DEL API
//-----------------------------------------------------------------------------------------
// instanciamos moongoose para administrar mongoDb
var mongoose = require('mongoose');
// instanciamos nuestro archivo de aplicacion
var app = require('./app');
// variable de puerto de conexion de nuestro api
var port = 3800;
// iniciamos mongoose
mongoose.Promise = global.Promise;
//conexion a la base de datos alojada en mongoDb atlas
mongoose.connect('mongodb+srv://NefosAppUser:dana2002@cluster0-rxn0l.mongodb.net/test?retryWrites=true&w=majority'
    , { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("la conexion a la base de datos Api de NefosSocial se se realizo con exito");
        // abrimos el puerto
        app.listen(port, () => {
            console.log("servidor corriendo http://localhost:3800");
        })
    })
    .catch(err => console.log(err));