'use strict'

import { Router } from 'express';
import { registerUser, loginUser, getUsers,getImageFile, getCounters } from '../controllers/user.controller.js';
import { authenticateUser } from '../services/jwt.js';
import multipart from 'connect-multiparty';

const api = Router();
const md_upload =  multipart({uploadDir: './uploads/users'});

api.post('/register', registerUser);
api.post('/login', loginUser);
//api.get('/user/:id', authenticateUser, getUser);
api.get('/users/:page?',authenticateUser, getUsers ); 
// api.put('/update-user/:id',authenticateUser,updateUser);
//api.post('/upload-image-user/:id',[authenticateUser,md_upload],uploadImage);
api.get('/get-image-user/:imageFile',getImageFile);
api.get('/counters/:id?',authenticateUser,getCounters);

export default api;