/**
 * @file appointmentController.ts
 * @description Controladores HTTP para todos los recursos del sistema.
 *
 * Patrón MVC: los controladores reciben la petición HTTP, delegan la lógica
 * al servicio correspondiente, y devuelven la respuesta con el código HTTP adecuado.
 *
 * Códigos de respuesta usados:
 *  - 200 OK         → lectura o actualización exitosa
 *  - 201 Created    → recurso creado exitosamente
 *  - 204 No Content → eliminación exitosa (sin body)
 *  - 404 Not Found  → recurso no encontrado
 */

import { Request, Response } from 'express';
import * as svc from '../services/appointmentService';
import { AppointmentStatus } from '../models/appointment';

// ─────────────────────────────────────────────
//  ÁREAS
// ─────────────────────────────────────────────

/** GET /areas — Lista todas las áreas médicas */
export const getAreas = (_: Request, res: Response) =>
  res.json(svc.getAllAreas());

/** GET /areas/:id — Obtiene un área por su ID */
export const getArea = (req: Request, res: Response) => {
  const area = svc.getAreaById(req.params.id);
  area ? res.json(area) : res.status(404).json({ error: 'Área no encontrada' });
};

/** POST /areas — Crea una nueva área médica */
export const createArea = (req: Request, res: Response) =>
  res.status(201).json(svc.createArea(req.body));

/** PUT /areas/:id — Actualiza los datos de un área */
export const updateArea = (req: Request, res: Response) => {
  const area = svc.updateArea(req.params.id, req.body);
  area ? res.json(area) : res.status(404).json({ error: 'Área no encontrada' });
};

/** DELETE /areas/:id — Elimina un área del sistema */
export const deleteArea = (req: Request, res: Response) =>
  svc.deleteArea(req.params.id)
    ? res.status(204).send()
    : res.status(404).json({ error: 'Área no encontrada' });

// ─────────────────────────────────────────────
//  DOCTORES
// ─────────────────────────────────────────────

/** GET /doctors — Lista todos los doctores */
export const getDoctors = (_: Request, res: Response) =>
  res.json(svc.getAllDoctors());

/** GET /doctors/:id — Obtiene un doctor por su ID */
export const getDoctor = (req: Request, res: Response) => {
  const doctor = svc.getDoctorById(req.params.id);
  doctor ? res.json(doctor) : res.status(404).json({ error: 'Doctor no encontrado' });
};

/** POST /doctors — Registra un nuevo doctor */
export const createDoctor = (req: Request, res: Response) =>
  res.status(201).json(svc.createDoctor(req.body));

/** PUT /doctors/:id — Actualiza los datos de un doctor */
export const updateDoctor = (req: Request, res: Response) => {
  const doctor = svc.updateDoctor(req.params.id, req.body);
  doctor ? res.json(doctor) : res.status(404).json({ error: 'Doctor no encontrado' });
};

/** DELETE /doctors/:id — Elimina un doctor del sistema */
export const deleteDoctor = (req: Request, res: Response) =>
  svc.deleteDoctor(req.params.id)
    ? res.status(204).send()
    : res.status(404).json({ error: 'Doctor no encontrado' });

// ─────────────────────────────────────────────
//  PACIENTES
// ─────────────────────────────────────────────

/** GET /patients — Lista todos los pacientes */
export const getPatients = (_: Request, res: Response) =>
  res.json(svc.getAllPatients());

/** GET /patients/:id — Obtiene un paciente por su ID */
export const getPatient = (req: Request, res: Response) => {
  const patient = svc.getPatientById(req.params.id);
  patient ? res.json(patient) : res.status(404).json({ error: 'Paciente no encontrado' });
};

/** POST /patients — Registra un nuevo paciente */
export const createPatient = (req: Request, res: Response) =>
  res.status(201).json(svc.createPatient(req.body));

/** PUT /patients/:id — Actualiza los datos de un paciente */
export const updatePatient = (req: Request, res: Response) => {
  const patient = svc.updatePatient(req.params.id, req.body);
  patient ? res.json(patient) : res.status(404).json({ error: 'Paciente no encontrado' });
};

/** DELETE /patients/:id — Elimina un paciente del sistema */
export const deletePatient = (req: Request, res: Response) =>
  svc.deletePatient(req.params.id)
    ? res.status(204).send()
    : res.status(404).json({ error: 'Paciente no encontrado' });

// ─────────────────────────────────────────────
//  CITAS MÉDICAS
// ─────────────────────────────────────────────

/** GET /appointments — Lista todas las citas con datos de paciente, doctor y área */
export const getAll = (_: Request, res: Response) =>
  res.json(svc.getAllAppointments());

/** GET /appointments/:id — Obtiene el detalle completo de una cita */
export const getOne = (req: Request, res: Response) => {
  const appt = svc.getAppointmentById(req.params.id);
  appt ? res.json(appt) : res.status(404).json({ error: 'Cita no encontrada' });
};

/** POST /appointments — Crea una nueva cita (estado inicial: pendiente) */
export const create = (req: Request, res: Response) =>
  res.status(201).json(svc.createAppointment(req.body));

/** PUT /appointments/:id — Actualiza todos los campos editables de una cita */
export const update = (req: Request, res: Response) => {
  const appt = svc.updateAppointment(req.params.id, req.body);
  appt ? res.json(appt) : res.status(404).json({ error: 'Cita no encontrada' });
};

/**
 * PATCH /appointments/:id/status — Cambia únicamente el estado de una cita.
 * Endpoint separado para respetar el principio de responsabilidad única.
 */
export const updateStatus = (req: Request, res: Response) => {
  const appt = svc.updateAppointmentStatus(req.params.id, req.body.status as AppointmentStatus);
  appt ? res.json(appt) : res.status(404).json({ error: 'Cita no encontrada' });
};

/** DELETE /appointments/:id — Elimina una cita del sistema */
export const remove = (req: Request, res: Response) =>
  svc.deleteAppointment(req.params.id)
    ? res.status(204).send()
    : res.status(404).json({ error: 'Cita no encontrada' });

// ─────────────────────────────────────────────
//  ESTADÍSTICAS
// ─────────────────────────────────────────────

/** GET /stats — Retorna métricas globales del sistema para el Dashboard */
export const getStats = (_: Request, res: Response) =>
  res.json(svc.getStats());
