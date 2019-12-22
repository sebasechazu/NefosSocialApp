'use strict'

var User = require('../models/User');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function home(req, res) {
    res.status(200).send({
        message: "hola mundo desde home"
    });
}
function pruebas(req, res) {
    console.log(req.body)
    res.status(200).send({
        message: "metodo de pruebas desde user.js en controller"
    });
}
//GUARDAR USUARIO
function saveUser(req, res) {
    var params = req.body;
    var user = new User();

    if (params.name && params.surname && params.nickname && params.email && params.password) {

        user.name = params.name;
        user.surname = params.surname;
        user.nickname = params.nickname;
        user.email = params.email;
        user.password = params.password;
        user.role = 'ROLE_USER';
        user.image = null;

        //control de usuarios duplicados
        User.find({
            $or: [
                { email: user.email.toLowerCase() },
                { nickname: user.nickname.toLowerCase() }
            ]
        }).exec((err, users) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion de usuarios' });

            if (users && users.length >= 1) {
                return res.status(200).send({ mesagge: 'el usuario que intentas registrar ya existe' });
            } else {
                //cifra y guarda los datos
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;
                    user.save((err, userStore) => {
                        if (err) return res.status(500).send({ mesagge: 'error al guardar el usuario' });
                        if (userStore) {
                            res.status(200).send({ user: userStore });
                        } else {
                            res.status(404).send({ mesagge: 'no se ha registrado el usuario' });
                        }
                    });
                });
            }
        });

    } else {
        res.status(200).send({
            mesagge: 'Envia todos los campos necesarios!!!'
        });
    }

}
//LOGIN DE USUARIO
function loginUser(req, res) {
    //variables de uso local que sirven para verificar si el mail y password se encuentran en la base de datos
    var params = req.body;
    var email = params.email;
    var password = params.password;
    //busque de un solo registro si encuentra el mail en la base de datos
    User.findOne({ email: email }, (err, user) => {
        //si se produce un error en la peticion
        if (err) return res.status(500).send({ message: 'error en la peticion' });
        //si encontramos al usuario
        if (user) {
            //comparamos al usuario en la base de datos
            bcrypt.compare(password, user.password, (err, check) => {
                //si es correcto
                if (check) {
                    //si obtenemos el toqen
                    if (params.gettoken) {
                        //devolver token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });

                    } else {
                        //devolcer datos del usuario
                        user.password = undefined;
                        return res.status(200).send({ user });
                    }
                } else {
                    return res.status(500).send({ message: 'el usuario no se ha podido identificar' });
                }
            })
        } else {
            return res.status(404).send({ message: 'el usuario no se ha podido identificar!!!' });
        }
    }

    );
}
//DATOS DE UN USUARIO
function getUser(req,res) {
    var  userId = req.params.id;

    User.findById(userId,(err,user)=>{
        if(err) return res.status(500).send({ message: 'error en la peticion' });

        if(!user) return res.status(404).send({ message: 'El Usuario no existe' });

        return res.status(200).send({user});

    });


    
}
module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser
}