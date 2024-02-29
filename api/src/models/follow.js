'use strict'
// ------------------------------------------------------------------------------------------------
// MODELO DE FOLLOW
// ------------------------------------------------------------------------------------------------
// Importamos el modulo de mongose en una variable
var mongoose = require('mongoose');
// Utilizamos Schema de mongoose para crear un esquema
var Schema = mongoose.Schema;
// Creamos una variable utilizando objetid para establecer la realcion con otros modelos
var ObjetId = Schema.Types.ObjectId;
// Creamos esquema de datos de publicacion
var FollowSchema = Schema({
    user: { 
        type: ObjetId, 
        // Relacion con la entidad Usuario como usuario seguido
        ref: 'User' },      
    followed: { 
        type: ObjetId, 
        // Relacion con la entidad Usuario como usuario seguidor
        ref: 'User' }   
});
// Exportamos el modelo como 'Follow'
module.exports = mongoose.model('Follow', FollowSchema);
// ------------------------------------------------------------------------------------------------