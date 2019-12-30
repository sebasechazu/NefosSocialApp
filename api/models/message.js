'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjetId = Schema.Types.ObjectId;

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

module.exports = mongoose.model('Message', messageSchema);