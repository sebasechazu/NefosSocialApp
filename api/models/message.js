'use strict'
// ------------------------------------------------------------------------------------------------
// MODELO DE MENSAJE
// ------------------------------------------------------------------------------------------------
var mongoose = require('mongoose');
// utlisamos schema de moongose
var Schema = mongoose.Schema;
//utilisamos ObjectId para relacionar con otra entidad
var ObjetId = Schema.Types.ObjectId;
// el modelo utilisa una relacion con la entidad user
var messageSchema = Schema({
    emitter: { 
        type: ObjetId, 
        ref: 'User' },
    receiver: { 
        type: ObjetId, 
        ref: 'User' },
    text:String,
    viewed:String,
    created_at:String
    
});
// exportamos el modelo
module.exports = mongoose.model('Message', messageSchema);