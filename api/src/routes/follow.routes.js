'use strict'

import { Router } from 'express';
import { saveFollow, deleteFollow, getFollowingUsers, getFollowedUser, getMyFollows } from '../controllers/follow.controller.js';
import { authenticateUser } from '../services/jwt.js';

const api = Router();

api.post('/follow', authenticateUser, saveFollow);
api.delete('/follow/:id', authenticateUser, deleteFollow);
api.get('/following/:id?/:page?', authenticateUser, getFollowingUsers);
api.get('/followed/:id?/:page?', authenticateUser, getFollowedUser);
api.get('/get-my-follows/:followed?', authenticateUser, getMyFollows);

export default api;