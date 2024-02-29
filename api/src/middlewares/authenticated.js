'use strict'
import { decode } from 'jwt-simple';

import moment from 'moment';

const secret = 'clave_secreta_NefosSocialApp';

export function ensureAuth (req, res, next) {
    
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'la peticion no tiene la cabecera de autenticacion' });
    }
    var token = req.headers.authorization.replace(/['"]+/g, '');
    try {

        var payload = decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: 'el token a expirado' });
        }
    } catch (error) {
        return res.status(404).send({ message: 'el token no es valido' });
    }
    req.user = payload;
    next();
}