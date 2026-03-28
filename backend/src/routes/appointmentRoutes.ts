/**
 * @file appointmentRoutes.ts
 * @description Definición centralizada de todas las rutas de la API REST.
 *
 * Estructura de rutas:
 *  GET    /stats                        → Estadísticas globales
 *  GET    /areas                        → Listar áreas
 *  POST   /areas                        → Crear área
 *  GET    /areas/:id                    → Obtener área
 *  PUT    /areas/:id                    → Actualizar área
 *  DELETE /areas/:id                    → Eliminar área
 *  (misma estructura para /doctors y /patients)
 *  GET    /appointments                 → Listar citas (con JOIN)
 *  POST   /appointments                 → Crear cita (validada)
 *  GET    /appointments/:id             → Obtener cita
 *  PUT    /appointments/:id             → Actualizar cita
 *  PATCH  /appointments/:id/status      → Cambiar solo el estado
 *  DELETE /appointments/:id             → Eliminar cita
 */

import { Router } from 'express';
import * as c from '../controllers/appointmentController';
import { validateCreateAppointment, validateStatus } from '../middlewares/validateAppointment';

const router = Router();

// ── Estadísticas globales del sistema ────────────────
router.get('/stats', c.getStats);

// ── Áreas médicas ─────────────────────────────────────
router.get('/areas',          c.getAreas);
router.get('/areas/:id',      c.getArea);
router.post('/areas',         c.createArea);
router.put('/areas/:id',      c.updateArea);
router.delete('/areas/:id',   c.deleteArea);

// ── Doctores ──────────────────────────────────────────
router.get('/doctors',        c.getDoctors);
router.get('/doctors/:id',    c.getDoctor);
router.post('/doctors',       c.createDoctor);
router.put('/doctors/:id',    c.updateDoctor);
router.delete('/doctors/:id', c.deleteDoctor);

// ── Pacientes ─────────────────────────────────────────
router.get('/patients',        c.getPatients);
router.get('/patients/:id',    c.getPatient);
router.post('/patients',       c.createPatient);
router.put('/patients/:id',    c.updatePatient);
router.delete('/patients/:id', c.deletePatient);

// ── Citas médicas ─────────────────────────────────────
router.get('/appointments',                              c.getAll);
router.get('/appointments/:id',                          c.getOne);
router.post('/appointments',   validateCreateAppointment, c.create);
router.put('/appointments/:id',                          c.update);
router.patch('/appointments/:id/status', validateStatus, c.updateStatus); // Solo cambia el estado
router.delete('/appointments/:id',                       c.remove);

export default router;
