'use strict'
var jwt = require('jwt-simple');

var moment = require('moment');

var secret = 'clave_secreta_NefosSocialApp';

exports.ensureAuth = function (req, res, next) {
    //si el token no llega apropiadamente
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'la peticion no tiene la cabecera de autenticacion' });
    }
    //asignamos el toquena una variable y eliminamos las comillas dobles o simples reemplazandolas por nada
    var token = req.headers.authorization.replace(/['"]+/g, '');
    try {
        //decodificamos el token
        var payload = jwt.decode(token, secret);
        //si el token tienn fecha menos a la actual verificamos su expiracion
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: 'el token a expirado' });
        }
    } catch (error) {
        return res.status(404).send({ message: 'el token no es valido' });
    }

    req.user = payload;

    next();

}