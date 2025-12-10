// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import routes from './src/routes/index.js';
import dbConnection from './src/config/database.js';
import logger from './src/middlewares/logger.js';
import setupGlobalErrorHandlers from './src/middlewares/globalErrorHandler.js';
import errorHandler from './src/middlewares/errorHandler.js';

import { seedUsers } from './scripts/seedUsers.js';
import { seedProducts } from './scripts/seedProducts.js';
import { seedCategories } from './scripts/seedCategories.js';

dotenv.config();

// Configurar manejadores globales ANTES de crear la app
setupGlobalErrorHandlers();

const app = express();

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "https://ecommerce-1-jidb.onrender.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Fix universal CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});


// Middlewares
app.use(express.json());
app.use(logger);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('WELCOME!');
});

// Rutas de la API
app.use('/api', routes);

// 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    method: req.method,
    url: req.originalUrl,
  });
});

// Manejador de errores al final
app.use(errorHandler);

// Bootstrap async para DB + seeds + server
async function bootstrap() {
  try {
    await dbConnection();

    // ⚠️ Si NO quieres que se ejecute el seed siempre,
    // pon SEED=true en .env y usa esta condición:
    if (process.env.SEED === 'true') {
      await seedUsers();
      await seedCategories();
      await seedProducts();
    }

    const port = process.env.PORT ?? 3000;
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
}

bootstrap();
