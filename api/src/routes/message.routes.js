'use strict'
import { Router } from 'express';
import { saveMessage, getReceivedMessages, getEmmitMessages, getUnviewedMessages, setViewedMessages } from '../controllers/message.controller.js';
import { authenticateUser } from '../services/jwt.js';

const api = Router();

api.post('/message', authenticateUser, saveMessage);
api.get('/my-messages/:page?', authenticateUser, getReceivedMessages);
api.get('/messages/:page?', authenticateUser, getEmmitMessages);
api.get('/unviewed-messages', authenticateUser, getUnviewedMessages);
api.get('/set-viewed-messages', authenticateUser, setViewedMessages);

export default api;