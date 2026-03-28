/**
 * @file validateAppointment.ts
 * @description Middlewares de validación usando express-validator.
 *
 * Estos middlewares se intercalan en las rutas ANTES del controlador.
 * Si la validación falla, responden con 400 Bad Request y no llegan al controlador.
 *
 * Flujo: Request → validateCreateAppointment[] → controller → Response
 */

import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware genérico que verifica si existen errores de validación acumulados.
 * Si hay errores, responde 400 con el array de errores.
 * Si no hay errores, pasa el control al siguiente middleware/controlador.
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Devuelve todos los errores de validación encontrados
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

/**
 * Cadena de validación para crear o actualizar una cita médica.
 * Valida que los campos obligatorios estén presentes y con formato correcto.
 *
 * Uso: router.post('/appointments', validateCreateAppointment, controller.create)
 */
export const validateCreateAppointment = [
  body('patientId')
    .notEmpty()
    .withMessage('El ID del paciente es obligatorio'),

  body('doctorId')
    .notEmpty()
    .withMessage('El ID del doctor es obligatorio'),

  body('appointmentDate')
    .notEmpty()
    .isISO8601()
    .withMessage('La fecha debe estar en formato ISO 8601 (ej: 2025-05-10T09:30:00Z)'),

  body('reason')
    .trim()
    .notEmpty()
    .withMessage('El motivo de la cita es obligatorio'),

  // El middleware que ejecuta la validación debe ir al final de la cadena
  handleValidationErrors,
];

/**
 * Validación para el endpoint de cambio de estado.
 * Solo permite los 4 estados válidos del sistema.
 *
 * Uso: router.patch('/appointments/:id/status', validateStatus, controller.updateStatus)
 */
export const validateStatus = [
  body('status')
    .isIn(['pendiente', 'confirmada', 'cancelada', 'completada'])
    .withMessage('Estado inválido. Valores permitidos: pendiente, confirmada, cancelada, completada'),

  handleValidationErrors,
];
