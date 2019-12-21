'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var followSchema = Schema({
    user: { type: schema.ObjetId, ref: 'user' },
    followed: { type: schema.ObjetId, ref: 'user' }
    
});

module.exports = mongoose.model('follow', followSchema);