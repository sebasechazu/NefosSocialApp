'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjetId = Schema.Types.ObjectId;

var FollowSchema = Schema({
    user: { 
        type: ObjetId, 
        ref: 'User' },      
    followed: { 
        type: ObjetId, 
        ref: 'User' }   
});


module.exports = mongoose.model('Follow', FollowSchema);