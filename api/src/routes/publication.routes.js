'use strict'
import { Router } from 'express';
import { savePublication, getPublications, getPublicationsUser, getPublication, deletePublication, uploadImage, getImageFile } from '../controllers/publication.controller.js';
import { authenticateUser } from '../services/jwt.js';
import multipart from 'connect-multiparty';

const api = Router();
const md_upload = multipart({uploadDir:'./uploads/publications'});

api.post('/publication',authenticateUser,savePublication);
api.get('/publications/:page?',authenticateUser,getPublications);
api.get('/publications-user/:user/:page?',authenticateUser,getPublicationsUser);
api.get('/publication/:id',authenticateUser,getPublication);
api.delete('/publication/:id',authenticateUser,deletePublication);
api.post('/upload-img-pub/:id',[authenticateUser,md_upload],uploadImage);
api.get('/get-image-pub/:imageFile',getImageFile);

export default api;
