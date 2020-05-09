'use strict'
// ------------------------------------------------------------------------------------------------
// CONTROLADOR DE MENSAJES
// ------------------------------------------------------------------------------------------------
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');
// ------------------------------------------------------------------------------------------------
// MODELOS
// ------------------------------------------------------------------------------------------------
var Message = require('../models/Message');
// ------------------------------------------------------------------------------------------------
// ENVIAR MENSAJES
// ------------------------------------------------------------------------------------------------
function saveMessage(req, res) {
    // Obtiene de la solicitud los datos de un mensaje que ingresaron por un formulario
    var params = req.body;
    // si falta en el formulario el mensaje el texto el mensaje o o el receptor envia un  200
    if (!params.text || !params.receiver) {
        return res.status(200).send({ message: 'envia los datos necesarios' });
    }
    // declara la variable mensaje y setea los valores recibidos en  la solicitud
    var message = new Message();
    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = 'false';
    // guarda el mensaje en la base de datos 
    message.save((err, messageStored) => {
        // si hubo un error al guardar el mensaje envia un codigo de respuesta 500
        if (err) {
            return res.status(500).send({ message: 'error en la peticion' });
        }
        // si elmensaje que se quiere almacenar tiene un error enviamos un c d respuesta 500
        if (!messageStored) {
            return res.status(500).send({ message: 'error al guardar mensaje' });
        }
        // si es correcto envia un codigo de respuesta 200 y un json con el mensaje 
        res.status(200).send({ message: messageStored });
    });
}
// ------------------------------------------------------------------------------------------------
// OBTENER MENSAJES RECIBIDOS
// ------------------------------------------------------------------------------------------------
function getReceivedMessages(req, res) {
    // obtengo el id del usuario logeado
    var userId = req.user.sub;
    // declara una variable pagina y le asiga el valor 1 
    var page = 1;
    // si en la solicitud por paramtero un numero de pagina lo almacena en una variable
    if (req.params.page) {
        page = req.params.page;
    }
    // declara una variable por item por pagina en 4
    var itemPerPages = 4;
    // busca en la base de datos los mensajes  por el receptor y los almacena en un json  que tiene
    // los datos de emisor, nombre imagen y nickname
    Message.find({ receiver: userId }).populate('emitter', 'name surname image nickname _id')
        // ordena los mensajes por la fecha de creacion
        .sort('-created_at').paginate(page, itemPerPages, (err, messages, total) => {
            // si no se pudo ejecutar la peticion envia un CR 500
            if (err) return res.status(500).send({ message: 'error en la peticion' });
            // si no existen mensajes para mostrar en via un CR 404
            if (!messages) return res.status(404).send({ message: 'no hay mensajes que mostrar' });
            // si existen mensajes para mostrar envia un CR 200  
            res.status(200).send({
                // total de mensajes
                total: total,
                // total de paginas
                pages: Math.ceil(total / itemPerPages),
                // total de paginas
                messages
            });
        });
}
// ------------------------------------------------------------------------------------------------
// OBTENER MENSAJES ENVIADOS
// ------------------------------------------------------------------------------------------------
function getEmmitMessages(req, res) {
    // obtengo el id del usuario logeado
    var userId = req.user.sub;
    // declara una variable pagina y le asiga el valor 1 
    var page = 1;
    // si en la solicitud por paramtero un numero de pagina lo almacena en una variable
    if (req.params.page) {
        page = req.params.page;
    }
    // declara una variable por item por pagina en 4
    var itemPerPages = 4;
    // busca en la base de datos los mensajes  por el emisor r receptor y los almacena en un json 
    // que tiene los datos de emisor, nombre imagen y nickname
    Message.find({ emitter: userId }).populate('emitter receiver', 'name surname image nickname _id')
        // ordena los mensajes por la fecha de creacion
        .sort('-created_at').paginate(page, itemPerPages, (err, messages, total) => {
            // si no se pudo ejecutar la peticion envia un CR 500
            if (err) return res.status(500).send({ message: 'error en la peticion' });
            // si no existen mensajes para mostrar en via un CR 404
            if (!messages) return res.status(404).send({ message: 'no hay mensajes que mostrar' });
            // si existen mensajes para mostrar envia un CR 200  
            res.status(200).send({
                // total de mensajes
                total: total,
                // total de paginas
                pages: Math.ceil(total / itemPerPages),
                // total de paginas
                messages
            });
        });
}
// -------------------------------------------------------------------------------------------------
// CONTAR MENSAJES NO RECIBIDOS
// -------------------------------------------------------------------------------------------------
function getUnviewedMessages(req, res) {
    // obtengo el id del usuario logeado
    var userId = req.user.sub;
    // Busca en la base de datos los mensajes que no fueron leidos 
    Message.countDocuments({ receiver: userId, viewed: 'false' }).exec((err, count) => {
        // si no se pudo ejecutar la peticion envia un CR 500
        if (err) return res.status(500).send({ message: 'error en la peticion' });
        // si todo es correcto envia un CR 200 y la cantidad de mensajes no leidos
        res.status(200).send({
            'unviewed': count
        });
    });
}
//-------------------------------------------------------------------------------------------------
//MARCAR MENSAJES LEIDOS
//-------------------------------------------------------------------------------------------------
function setViewedMessages(req, res) {
    // obtenenos el id de usuario
    var userId = req.user.sub;
    //hacemos un update al mensaje donde marcamos al mensaje como leido
    Message.update({ receiver: userId, viewed: 'false' }, { viewed: 'true' }, { 'multi': true },
        (err, messagesUpdated) => {
            // si no se pudo ejecutar la peticion envia un codigo de de respuesta 500 
            if (err) return res.status(500).send({ message: 'error en la peticion' });
            // si no hay mesajes para marcar como leido encia un codigo de respuetsa 404
            if (!messagesUpdated) return res.status(404).send({ message: 'no hay mensajes para actualizar' });
            // si pudo actualizar los mesajes leidos envia un CR 200 y un json con los memsajes leidos
            res.status(200).send({
                messages: messagesUpdated
            });
        });
}
//-------------------------------------------------------------------------------------------------
module.exports = {
    saveMessage,
    getReceivedMessages,
    getEmmitMessages,
    getUnviewedMessages,
    setViewedMessages
}
//-------------------------------------------------------------------------------------------------