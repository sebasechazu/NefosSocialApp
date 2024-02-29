'use strict'
// ------------------------------------------------------------------------------------------------
// SERVICIO PARA CREACION DE TOKENS
// ------------------------------------------------------------------------------------------------
// Importamos el modulo jwt-simple
var jwt = require('jwt-simple');
// importamos el modulo de moment para administrar fechas
var moment = require('moment');
// Creamos una variable para usar como clave secreta
var secret = 'clave_secreta_NefosSocialApp';
// Exportamos una fucnion que crea tokens
exports.createToken = function (user) {
    // creamos que datos van a ser tokenizados
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        image: user.image,
        // parsemamos la fecha 
        iat: moment().unix(),
        // informamos la cantidad de dias de expiracion del token
        exp: moment().add(30, 'days').unix()
    };
    // devolvemos la variable pay load con los datos encriptados
    return jwt.encode(payload, secret);
};
// ------------------------------------------------------------------------------------------------