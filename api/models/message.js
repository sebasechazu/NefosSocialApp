'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var mesaggeSchema = Schema({
    emmiter: { type: schema.ObjetId, ref: 'user' },
    receiver: { type: schema.ObjetId, ref: 'user' },
    text:String,
    created_at:String
    
});

module.exports = mongoose.model('mesagge', mesaggeSchema);