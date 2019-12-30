'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjetId = Schema.Types.ObjectId;

var mesaggeSchema = Schema({
    emmiter: { 
        type: ObjetId, 
        ref: 'User' },
    receiver: { 
        type: ObjetId, 
        ref: 'User' },
    text:String,
    viewed:String,
    created_at:String
    
});

module.exports = mongoose.model('Mesagge', mesaggeSchema);