'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjetId = Schema.Types.ObjectId;

var FollowSchema = Schema({
    user: { 
        type: ObjetId, 
        ref: 'user' },      
    followed: { 
        type: ObjetId, 
        ref: 'user' }   
});


module.exports = mongoose.model('Follow', FollowSchema);