'use strict';

import { MongoClient, ServerApiVersion } from 'mongodb';
import { config } from 'dotenv';
import app from './app.js';

config();

const username = process.env.APP_USERNAME;
const password = process.env.PASSWORD;
const dbName = process.env.DB_NAME;
const port = process.env.PORT;

const uri = `mongodb+srv://${username}:${password}@cluster0.6gwvgg8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function connectDatabase() {
  try {
    await client.connect();
    console.log('Conexión exitosa a la base de datos');
    app.locals.db = client.db(dbName);
    console.log('Base de datos conectada:', dbName);
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw error; 
  }
}

export function getApp() {
  return app;
}

export function getDatabase() {
  if (!app.locals.db) {
    throw new Error('La base de datos no está conectada. Asegúrate de llamar a connectDatabase antes de usar getDatabase.');
  }
  return app.locals.db;
}

export async function startServer() {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log('Cerrando la conexión a la base de datos');
  await client.close();
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();

