'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var publicationSchema = Schema({
    user: { type: schema.ObjetId, ref: 'user' },
    text: String,
    file: String,
    created_at: String
});

module.exports = mongoose.model('publication', publicationSchema);