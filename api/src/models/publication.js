'use strict'
// ------------------------------------------------------------------------------------------------
// MODELO DE PUBLICACION
// ------------------------------------------------------------------------------------------------
// Importamos el modulo de mongose en una variable
var mongoose = require('mongoose');
// Utilizamos Schema de mongoose para crear un esquema
var Schema = mongoose.Schema;
// Creamos una variable utilizando objetid para establecer la realcion con otros modelos
var ObjetId = Schema.Types.ObjectId;
// Creamos esquema de datos de publicacion
var publicationSchema = Schema({
    user: { 
        type: ObjetId, 
        // Relacion con la entidad Usuario como usuario creador de la publicacion
        ref: 'User' },
    text: String,
    file: String,
    created_at: String
});
// Exportamos el modelo de Usuario como "Publication"
module.exports = mongoose.model('Publication', publicationSchema);
// ------------------------------------------------------------------------------------------------