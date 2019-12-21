'use strict'
var jwt = require('jwt-simple');

var moment = require('moment');

var secret = 'clave_secreta_NefosSocialApp';

exports.ensureAuth = function(res,res,next){
    if(!req.headers.authorization){
        return res.status(403).send({message:'la peticion no tiene la cabecera de autenticacion'});
    }

    var token = req.headers.authorization.replace(/['"]+/g,'');

    

}