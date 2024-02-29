'use strict'

import moment from 'moment';
import Message from '../models/message.model.js';

export function saveMessage(req, res) {

    var params = req.body;

    if (!params.text || !params.receiver) {
        return res.status(200).send({ message: 'envia los datos necesarios' });
    }

    var message = new Message();
    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = 'false';

    message.save((err, messageStored) => {

        if (err) {
            return res.status(500).send({ message: 'error en la peticion' });
        }

        if (!messageStored) {
            return res.status(500).send({ message: 'error al guardar mensaje' });
        }

        res.status(200).send({ message: messageStored });
    });
}

export function getReceivedMessages(req, res) {
    
    var userId = req.user.sub;
    
    var page = 1;
    
    if (req.params.page) {
        page = req.params.page;
    }
    
    var itemPerPages = 4;
    
    Message.find({ receiver: userId }).populate('emitter', 'name surname image nickname _id')
        
        .sort('-created_at').paginate(page, itemPerPages, (err, messages, total) => {
           
            if (err) return res.status(500).send({ message: 'error en la peticion' });
           
            if (!messages) return res.status(404).send({ message: 'no hay mensajes que mostrar' });
            
            res.status(200).send({
                
                total: total,               
                pages: Math.ceil(total / itemPerPages),
                messages
            });
        });
}

export function getEmmitMessages(req, res) {
    
    var userId = req.user.sub;
    
    var page = 1;
    
    if (req.params.page) {
        page = req.params.page;
    }
    
    var itemPerPages = 4;
    
    Message.find({ emitter: userId }).populate('emitter receiver', 'name surname image nickname _id')
        .sort('-created_at').paginate(page, itemPerPages, (err, messages, total) => {
            
            if (err) return res.status(500).send({ message: 'error en la peticion' });
            
            if (!messages) return res.status(404).send({ message: 'no hay mensajes que mostrar' });
              
            res.status(200).send({
                total: total,
                pages: Math.ceil(total / itemPerPages),
                messages
            });
        });
}

export function getUnviewedMessages(req, res) {

    var userId = req.user.sub;

    Message.countDocuments({ receiver: userId, viewed: 'false' }).exec((err, count) => {

        if (err) return res.status(500).send({ message: 'error en la peticion' });

        res.status(200).send({
            'unviewed': count
        });
    });
}

export function setViewedMessages(req, res) {

    var userId = req.user.sub;

    Message.update({ receiver: userId, viewed: 'false' }, { viewed: 'true' }, { 'multi': true },
        (err, messagesUpdated) => {

            if (err) return res.status(500).send({ message: 'error en la peticion' });

            if (!messagesUpdated) return res.status(404).send({ message: 'no hay mensajes para actualizar' });

            res.status(200).send({
                messages: messagesUpdated
            });
        });
}

export default {
    saveMessage,
    getReceivedMessages,
    getEmmitMessages,
    getUnviewedMessages,
    setViewedMessages
}
