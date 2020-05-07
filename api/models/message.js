'use strict'
// ------------------------------------------------------------------------------------------------
// MODELO DE MENSAJE
// ------------------------------------------------------------------------------------------------
// Importamos el modulo de mongose en una variable
var mongoose = require('mongoose');
// Utilizamos Schema de mongoose para crear un esquema
var Schema = mongoose.Schema;
// Creamos una variable utilizando objetid para establecer la realcion con otros modelos
var ObjetId = Schema.Types.ObjectId;
// Creamos esquema de datos de mensaje
var messageSchema = Schema({
    emitter: { 
        type: ObjetId,
        // Relacion con la entidad Usuario como usuario emisor
        ref: 'User' },
    receiver: { 
        type: ObjetId, 
        // Relacion con la entidad Usuario como usuario Receptor
        ref: 'User' },
    text:String,
    viewed:String,
    created_at:String
});
// exportamos el modelo como 'Message'
module.exports = mongoose.model('Message', messageSchema);
// ------------------------------------------------------------------------------------------------