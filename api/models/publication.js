'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjetId = Schema.Types.ObjectId;


var publicationSchema = Schema({
    user: { 
        type: ObjetId, 
        ref: 'User' },
    text: String,
    file: String,
    created_at: String
});

module.exports = mongoose.model('Publication', publicationSchema);