/**
 * @file app.ts
 * @description Punto de entrada del servidor Express.
 *
 * Responsabilidades:
 *  1. Configurar middlewares globales (CORS, JSON parser)
 *  2. Registrar las rutas de la API
 *  3. Inicializar la base de datos antes de aceptar peticiones
 *  4. Arrancar el servidor en el puerto configurado
 */

import express from 'express';
import cors from 'cors';
import { initDatabase } from './db/database';
import routes from './routes/appointmentRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middlewares globales ──────────────────────────────

// Habilita CORS para todas las rutas (necesario para que el frontend en :5173 pueda llamar al backend en :3001)
app.use(cors());

// Parsea el body de las peticiones como JSON
app.use(express.json());

// ── Rutas ─────────────────────────────────────────────

// Registra todas las rutas del sistema bajo la raíz '/'
app.use('/', routes);

// Endpoint de salud — útil para verificar que el servidor está corriendo
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── Inicialización ────────────────────────────────────

/**
 * Primero inicializamos la base de datos y solo entonces arrancamos el servidor.
 * Esto evita que lleguen peticiones antes de que la DB esté lista.
 */
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
      console.log(`📊 Stats disponibles en http://localhost:${PORT}/stats`);
    });
  })
  .catch((err) => {
    console.error('❌ Error al inicializar la base de datos:', err);
    process.exit(1); // Salida con código de error si la DB falla
  });

export default app;
