'use strict'
// ------------------------------------------------------------------------------------------------
// ARCHIVO DE CREACION DEL API
// ------------------------------------------------------------------------------------------------
// Importamos moongoose para administrar mongoDb
var mongoose = require('mongoose');
// Importamos nuestro archivo de aplicacion denominado app
var app = require('./app');
// Creamos una variable de puerto de conexion  en el puerto 3800
var port = 3800;
// Iniciamos mongooses
mongoose.Promise = global.Promise;
// Configuramos la onexion a la base de datos alojada en mongoDb atlas
mongoose.connect('mongodb+srv://NefosAppUser:dana2002@cluster0-rxn0l.mongodb.net/test?retryWrites='
    + 'true&w=majority'
    , { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // si la conexcion de realizo con exito informamos por consola
        console.log("la conexion a la base de datos Api de NefosSocial se se realizo con exito");
        // informamos en que puerto queda bierto para las coneciones 
        app.listen(port, () => {
            console.log("servidor corriendo http://localhost:3800");
        })
    })
    // en caso de encontarrnos con un error informamos por consola
    .catch(err => console.log(err));
// ------------------------------------------------------------------------------------------------