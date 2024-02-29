'use strict'
import { unlink} from 'fs';
import bcryptjs from 'bcryptjs';
import mongodb from 'mongodb';
import { resolve } from 'path';

import User from '../models/user.model.js';
import Follow from '../models/follow.model.js';
import Publication from '../models/publication.model.js';

import { createToken } from '../services/jwt.js';
import { getDatabase } from '../index.js';

const { compare, hashSync } = bcryptjs;
const { ObjectId } = mongodb;

export const registerUser = async (req, res) => {
    try {

        const params = req.body;

        if (params.name && params.surname && params.nickname && params.email && params.password) {

            const user = new User(

                params.name,
                params.surname,
                params.nickname,
                params.email,
                params.password,
                'ROLE_USER',
                null

            );

            const existingUser = await getDatabase().collection('users').findOne({ email: user.email.toLowerCase() });

            if (existingUser) {

                return res.status(200).send({ message: 'El usuario que intentas registrar ya existe' });
            }

            const hashedPassword = hashSync(params.password, 10);

            user.password = hashedPassword;

            const userStored = await getDatabase().collection('users').insertOne(user);

            if (userStored) {

                registerUser.password = undefined;
                return res.status(200).send({ message: 'Usuario registrado exitosamente', user: registerUser });

            } else {

                return res.status(404).send({ message: 'No se ha registrado el usuario' });

            }

        } else {

            return res.status(400).send({ message: 'Envía todos los campos necesarios' });

        }
    } catch (error) {

        return res.status(500).send({ message: error });

    }
};
// ----------------------------------------------
export const loginUser = async (req, res) => {
    try {

        const params = req.body;
        const email = params.email;
        const password = params.password;

        if (email && password) {

            const user = await getDatabase().collection('users').findOne({ email: email });

            if (user) {

                const passwordIsCorrect = await compare(password, user.password);

                if (passwordIsCorrect) {

                    const token = createToken(user);

                    if (params.gettoken) {

                        return res.status(200).send({ token });
                    } else {

                        user.password = undefined;
                        return res.status(200).send({ token, user });
                    }

                } else {

                    return res.status(500).send({ message: 'La contraseña es incorrecta' });
                }

            } else {

                return res.status(404).send({ message: 'el email ingresado no se encuentra registado' });
            }
        } else {

            return res.status(400).send({ message: 'Envía todos los campos necesarios' });
        }
    }

    catch (error) {

        return res.status(500).send({ message: error });
    }
};
// ----------------------------------------------
// export const getUser = async (req, res) => {

//     try {

//         const userId = req.params.id;

//         if (!ObjectId.isValid(userId)) {
//             return res.status(400).send({ message: 'ID de usuario no válido' });
//         }

//         const user = await getDatabase().collection('users').findOne({ _id: new ObjectId(userId) });

//         console.log(user);

//         if (!user)
//             return res.status(404).send({ message: 'El Usuario no existe' });

//         followThisUser(req.user.sub, userId).then((value) => {

//             user.password = undefined;

//             return res.status(200).send({
//                 user,
//                 following: value.following,
//                 followed: value.followed
//             });
//         });

//     } catch (error) {

//         return res.status(500).send({ message: error });
//     }
// }
// ----------------------------------------------
// async function followThisUser(identity_user_id, user_id) {

//     const following = await _findOne({ "user": identity_user_id, "followed": user_id })
//         .exec().then((follow) => {
//             return follow;
//         }).catch((err) => { return handleError(err) });

//     const followed = await _findOne({ "user": user_id, "followed": identity_user_id })
//         .exec().then((follow) => {
//             return follow;
//         }).catch((err) => { return handleError(err) });
//     return {
//         following: following,
//         followed: followed
//     }
// }
// ----------------------------------------------
export const getUsers = async (req, res) => {
    try {
        const users = await getDatabase().collection('users').find().toArray();

        users.forEach((user) => {
            user.password = undefined;
        });

        return res.status(200).send({ users });
    } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error);
        return res.status(500).send({ message: 'Error en la petición' });
    }
};

// export const updateUser = async (req, res) => {
//     try {

//         const userId = req.params.id;
//         const update = req.body;
//         delete update.password;

//         if (userId != req.user.sub) {
//             return res.status(500).send({ message: 'No tienes permisos para actualizar datos' });
//         }

//         const filter = { _id: new ObjectId(userId) };

//         const options = { upsert: true };

//         var userIsset = false;

//         users.forEach((user) => {
//             if (user && user._id != userId) userIsset = true;
//         });

//         if (userIsset)
//             return res.status(404).send({ message: 'los datos ya estan en uso' });

//         findByIdAndUpdate(userId, update, { new: true, useFindAndModify: false },
//             (err, userUpdated) => {

//                 if (err)
//                     return res.status(500).send({ message: 'Existe un error en la peticion' });

//                 if (!userUpdated)
//                     return res.status(404)
//                         .send({ message: 'No se ha podido actualizar el usuario' });

//                 return res.status(200).send({ user: userUpdated });
//             });

//     } catch (error) {

//         return res.status(500).send({ message: error });

//     }

// }

// export function uploadImage(req, res) {

//     var userId = req.params.id;
//     if (req.files) {

//         var file_path = req.files.image.path;
//         var file_split = file_path.split('\\');
//         var file_name = file_split[2];
//         var ext_split = file_name.split('\.');
//         var file_ext = ext_split[1];

//         if (userId != req.user.sub) {

//             return removeFilesOfUploads(res, file_path,
//                 'No tienes permisos para actualizar datos');
//         }

//         if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jepg' || file_ext == 'gif') {

//             findByIdAndUpdate(userId, { image: file_name },
//                 { new: true, useFindAndModify: false },
//                 (err, userUpdated) => {

//                     if (err) return res.status(500)
//                         .send({ message: 'Existe un error en la peticion' });

//                     if (!userUpdated) return res.status(404)
//                         .send({ message: 'No se ha podido actualizar el usuario' });

//                     return res.status(200).send({ user: userUpdated });
//                 });
//         } else {
//             return removeFilesOfUploads(res, file_path, 'extension no valida');
//         }
//     } else {
//         return res.status(200).send({ mesagge: ' no se han subido archivos' });
//     }
// }

// funciones 

// async function followUserIds(user_id) {
//     try {

//         var following = await _find({ "user": user_id }).select({ '_id': 0, '__v': 0, 'user': 0 }).exec()
//             .then((follows) => { return follows; }).catch((err) => { return handleError(err) });

//         var followed = await _find({ "followed": user_id }).select({ '_id': 0, '__v': 0, 'followed': 0 }).exec()
//             .then((follows) => { return follows; }).catch((err) => { return handleError(err) });

//         var following_clean = [];
//         following.forEach((follow) => {
//             following_clean.push(follow.followed);
//         });

//         var followed_clean = [];
//         followed.forEach((follow) => {
//             followed_clean.push(follow.user);
//         });

//         return {
//             following: following_clean,
//             followed: followed_clean
//         }
//     } catch (e) {
//         console.log(e);
//     }
// }

export function removeFilesOfUploads(res, file_path, mensage) {
    unlink(file_path, (err) => {

        return res.status(200).send({ mesagge: mensage });
    });
}

export function getImageFile(req, res) {

    var image_File = req.params.imageFile;

    var path_file = './uploads/users/' + image_File;

    _exists(path_file, (exists) => {

        if (exists) {

            res.sendFile(resolve(path_file));
        } else {

            res.status(200).send({ mesagge: 'no existe la imagen' });
        }
    });
}

export function getCounters(req, res) {

    var userId = req.user.sub;

    if (req.params.id) {
        userId = req.params.id;
    }

    getCountFollow(userId).then((value) => {
        return res.status(200).send(value);
    });
}

// async function getCountFollow(user_id) {

//     var following = await countDocuments({ "user": user_id })
//         .exec()
//         .then((count) => {
//             return count;
//         })
//         .catch((err) => { return handleError(err); });

//     var followed = await countDocuments({ "followed": user_id })
//         .exec()
//         .then((count) => {
//             return count;
//         })
//         .catch((err) => { return handleError(err); });

//     var publications = await _countDocuments({ 'user': user_id })
//         .exec()
//         .then((count) => {
//             return count;
//         })
//         .catch((err) => { return handleError(err); });
//     return {
//         following: following,
//         followed: followed,
//         publications: publications
//     }
// }

export default {
    registerUser,
    loginUser,
    getUsers,
    getImageFile,
    getCounters,
    //getUser,
    //updateUser,
    //uploadImage,
}