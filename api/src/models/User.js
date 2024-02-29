'use strict'
// ------------------------------------------------------------------------------------------------
// MODELO DE USUARIO
// ------------------------------------------------------------------------------------------------
// Importamos el modulo de mongose en una variable
var mongoose = require('mongoose');
// Utilizamos Schema de mongoose para crear un esquema
var Schema = mongoose.Schema;
// Creamos esquema de datos de usuario
var userSchema = Schema({
    name: String,
    surname: String,
    nickname: String,
    email: String,
    password: String,
    role: String,
    image: String
});
// Exportamos el modelo como "User"
module.exports = mongoose.model('User', userSchema);
// ------------------------------------------------------------------------------------------------