'use strict'
// ------------------------------------------------------------------------------------------------
// MODELO DE USUARIO
// ------------------------------------------------------------------------------------------------
// Instanciamos moongosse
var mongoose = require('mongoose');
// Utilizamos Schema de moongose para crear el modelo de datos
var Schema = mongoose.Schema;
// Creamos modelo de datos de Usuario
var userSchema = Schema({
    name: String,
    surname: String,
    nickname: String,
    email: String,
    password: String,
    role: String,
    image: String
});
// Exportamos el modelo de Usuario como "User"
module.exports = mongoose.model('User',userSchema);