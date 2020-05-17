'use strict'
// ------------------------------------------------------------------------------------------------
// ARCHIVO DE CREACION DEL API
// ------------------------------------------------------------------------------------------------
// Importamos moongoose para administrar mongoDb
var mongoose = require('mongoose');
// Importamos nuestro archivo de aplicacion denominado app
var app = require('./app');
// Creamos una variable de puerto de conexion  en el puerto 3800
require('./global');
// Iniciamos mongooses
mongoose.Promise = global.Promise;
// Configuramos la conexion a la base de datos alojada en mongoDb atlas
mongoose.connect(mongoCloud
    , { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { mongoCloud
        // si la conexcion de realizo con exito informamos por consola
        console.log("la conexion a la base de datos  NefosSocial se se realizo con exito");
        // informamos en que puerto queda bierto para las coneciones 
        app.listen(port, () => {
            console.log("servidor corriendo http://localhost:3800");
        })
    })
    // en caso de encontarrnos con un error informamos por consola
    .catch(err => console.log(err));
// ------------------------------------------------------------------------------------------------