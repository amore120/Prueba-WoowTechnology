/**
 * @file api.ts
 * @description Cliente HTTP centralizado para consumir la API del backend.
 *
 * Usa Axios con una instancia configurada (baseURL apunta al backend en :3001).
 * Todas las funciones retornan Promesas tipadas con las interfaces del sistema.
 *
 * Patrón: cada función corresponde a un endpoint REST específico.
 * Los componentes y screens importan estas funciones en lugar de llamar a Axios directamente.
 */

import axios from 'axios';
import {
  AppointmentView, AppointmentStatus, CreateAppointmentDTO,
  Area, CreateAreaDTO,
  Doctor, CreateDoctorDTO,
  Patient, CreatePatientDTO,
  Stats,
} from '../types/appointment';

/** Instancia de Axios preconfigurada con la URL base del backend */
const api = axios.create({ baseURL: 'http://localhost:3001' });

// ── Estadísticas ──────────────────────────────────────

/** Obtiene las métricas globales del sistema para el Dashboard */
export const fetchStats = (): Promise<Stats> =>
  api.get('/stats').then(r => r.data);

// ── Áreas ─────────────────────────────────────────────

/** Lista todas las áreas médicas disponibles */
export const fetchAreas = (): Promise<Area[]> =>
  api.get('/areas').then(r => r.data);

/** Crea una nueva área médica */
export const createArea = (data: CreateAreaDTO) =>
  api.post('/areas', data).then(r => r.data);

/** Actualiza los datos de un área existente */
export const updateArea = (id: string, data: Partial<CreateAreaDTO>) =>
  api.put(`/areas/${id}`, data).then(r => r.data);

/** Elimina un área del sistema */
export const deleteArea = (id: string) =>
  api.delete(`/areas/${id}`);

// ── Doctores ──────────────────────────────────────────

/** Lista todos los doctores registrados */
export const fetchDoctors = (): Promise<Doctor[]> =>
  api.get('/doctors').then(r => r.data);

/** Registra un nuevo doctor */
export const createDoctor = (data: CreateDoctorDTO) =>
  api.post('/doctors', data).then(r => r.data);

/** Actualiza los datos de un doctor */
export const updateDoctor = (id: string, data: Partial<CreateDoctorDTO>) =>
  api.put(`/doctors/${id}`, data).then(r => r.data);

/** Elimina un doctor del sistema */
export const deleteDoctor = (id: string) =>
  api.delete(`/doctors/${id}`);

// ── Pacientes ─────────────────────────────────────────

/** Lista todos los pacientes registrados */
export const fetchPatients = (): Promise<Patient[]> =>
  api.get('/patients').then(r => r.data);

/** Registra un nuevo paciente */
export const createPatient = (data: CreatePatientDTO) =>
  api.post('/patients', data).then(r => r.data);

/** Actualiza los datos personales de un paciente */
export const updatePatient = (id: string, data: Partial<CreatePatientDTO>) =>
  api.put(`/patients/${id}`, data).then(r => r.data);

/** Elimina un paciente del sistema */
export const deletePatient = (id: string) =>
  api.delete(`/patients/${id}`);

// ── Citas médicas ─────────────────────────────────────

/** Lista todas las citas con datos de paciente, doctor y área resueltos (JOIN) */
export const fetchAppointments = (): Promise<AppointmentView[]> =>
  api.get('/appointments').then(r => r.data);

/** Obtiene el detalle completo de una cita por su ID */
export const fetchAppointmentById = (id: string): Promise<AppointmentView> =>
  api.get(`/appointments/${id}`).then(r => r.data);

/** Crea una nueva cita médica (estado inicial automático: 'pendiente') */
export const createAppointment = (data: CreateAppointmentDTO) =>
  api.post('/appointments', data).then(r => r.data);

/** Actualiza todos los campos editables de una cita */
export const updateAppointment = (id: string, data: Partial<CreateAppointmentDTO>) =>
  api.put(`/appointments/${id}`, data).then(r => r.data);

/**
 * Cambia solo el estado de una cita.
 * Usa PATCH en lugar de PUT para indicar una actualización parcial.
 */
export const updateStatus = (id: string, status: AppointmentStatus) =>
  api.patch(`/appointments/${id}/status`, { status }).then(r => r.data);

/** Elimina una cita del sistema */
export const deleteAppointment = (id: string) =>
  api.delete(`/appointments/${id}`);
