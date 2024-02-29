'use strict'
// ------------------------------------------------------------------------------------------------
// MIDDLEWARE DE AUTENTIFICACION
// ------------------------------------------------------------------------------------------------
// Importamos a jwt-simple
var jwt = require('jwt-simple');
// importamos moment para adminitrars fechas
var moment = require('moment');
// Creamos una variable secret para almacenar en nuestra app una clave
var secret = 'clave_secreta_NefosSocialApp';
// Exportamos fuera del modulo una funcion  
exports.ensureAuth = function (req, res, next) {
    // Manejos un respuesta de error 403 si el token no llega apropiadamente
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'la peticion no tiene la cabecera de autenticacion' });
    }
    //asignamos el toquen a una variable y eliminamos las comillas dobles o simples reemplazandolas por nada
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
    // si el token viene correctamente verificamos el usuario
    req.user = payload;
    next();
}
// ------------------------------------------------------------------------------------------------