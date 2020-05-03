'use strict'
// ------------------------------------------------------------------------------------------------
// MODELO DE FOLLOW
// ------------------------------------------------------------------------------------------------
var mongoose = require('mongoose');
// utlisamos schema de moongose
var Schema = mongoose.Schema;
//utilisamos ObjectId para relacionar con otra entidad
var ObjetId = Schema.Types.ObjectId;
// el modelo utilisa una relacion con la entidad user
var FollowSchema = Schema({
    user: { 
        type: ObjetId, 
        ref: 'User' },      
    followed: { 
        type: ObjetId, 
        ref: 'User' }   
});
// exportamos el modelo
module.exports = mongoose.model('Follow', FollowSchema);