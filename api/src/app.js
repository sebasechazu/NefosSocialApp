'use strict'
import express, { urlencoded, json } from 'express';
import cors from 'cors';
const app = express();
// rutas
import userRoutes from './routes/user.routes.js';
import followRoutes from './routes/follow.routes.js';
import publicationRoutes from './routes/publication.routes.js';
import messageRoutes from './routes/message.routes.js';
// middleware
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json());
// rutas
app.use('/api', userRoutes);
app.use('/api', followRoutes);
app.use('/api', publicationRoutes);
app.use('/api', messageRoutes);
// errores
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  });
export default app;