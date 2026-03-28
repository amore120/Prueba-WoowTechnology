/**
 * @file appointment.ts
 * @description Definición de tipos e interfaces TypeScript para todas las entidades del sistema.
 * Centraliza los contratos de datos usados por servicios, controladores y rutas.
 */

/** Estados posibles de una cita médica */
export type AppointmentStatus = 'pendiente' | 'confirmada' | 'cancelada' | 'completada';

/** Estado laboral de un doctor en el sistema */
export type DoctorStatus = 'activo' | 'inactivo';

/** Género del paciente */
export type Gender = 'masculino' | 'femenino' | 'otro';

// ─────────────────────────────────────────────
//  ÁREA MÉDICA
// ─────────────────────────────────────────────

/** Representa un área o departamento médico (Ej: Cardiología, Pediatría) */
export interface Area {
  id: string;           // UUID autogenerado
  name: string;         // Nombre del área
  description?: string; // Descripción opcional
  color: string;        // Color hex para identificación visual en la UI
  createdAt: string;    // Fecha ISO de creación
}

/** DTO para crear un área — omite campos autogenerados */
export type CreateAreaDTO = Omit<Area, 'id' | 'createdAt'>;

// ─────────────────────────────────────────────
//  DOCTOR
// ─────────────────────────────────────────────

/** Representa un médico registrado en el sistema */
export interface Doctor {
  id: string;           // UUID autogenerado
  name: string;         // Nombre completo
  specialty: string;    // Especialidad médica
  areaId?: string;      // Referencia al área asignada (FK → areas.id)
  phone?: string;       // Teléfono de contacto
  email?: string;       // Correo electrónico
  status: DoctorStatus; // Estado activo/inactivo
  createdAt: string;    // Fecha ISO de registro
}

/** DTO para crear un doctor — omite campos autogenerados */
export type CreateDoctorDTO = Omit<Doctor, 'id' | 'createdAt'>;

// ─────────────────────────────────────────────
//  PACIENTE
// ─────────────────────────────────────────────

/** Representa un paciente registrado en el sistema */
export interface Patient {
  id: string;          // UUID autogenerado
  name: string;        // Nombre completo
  dni?: string;        // Cédula o DNI
  phone?: string;      // Teléfono de contacto
  email?: string;      // Correo electrónico
  birthDate?: string;  // Fecha de nacimiento (ISO)
  gender?: Gender;     // Género del paciente
  address?: string;    // Dirección domiciliaria
  createdAt: string;   // Fecha ISO de registro
}

/** DTO para crear un paciente — omite campos autogenerados */
export type CreatePatientDTO = Omit<Patient, 'id' | 'createdAt'>;

// ─────────────────────────────────────────────
//  CITA MÉDICA
// ─────────────────────────────────────────────

/** Representa una cita médica con referencias a paciente, doctor y área */
export interface Appointment {
  id: string;               // UUID autogenerado
  patientId: string;        // FK → patients.id
  doctorId: string;         // FK → doctors.id
  areaId?: string;          // FK → areas.id (opcional)
  appointmentDate: string;  // Fecha y hora de la cita (ISO)
  reason: string;           // Motivo de la consulta
  status: AppointmentStatus;// Estado actual de la cita
  notes?: string;           // Notas adicionales opcionales
  createdAt: string;        // Fecha ISO de registro
}

/** DTO para crear una cita — omite campos autogenerados */
export type CreateAppointmentDTO = Omit<Appointment, 'id' | 'status' | 'createdAt'>;

/** DTO para actualizar una cita — todos los campos son opcionales */
export type UpdateAppointmentDTO = Partial<CreateAppointmentDTO>;

// ─────────────────────────────────────────────
//  VISTA ENRIQUECIDA (JOIN)
// ─────────────────────────────────────────────

/**
 * Vista de cita con datos resueltos de las relaciones.
 * Resultado de un JOIN entre appointments, patients, doctors y areas.
 */
export interface AppointmentView extends Appointment {
  patientName: string;  // Nombre del paciente (de patients.name)
  doctorName: string;   // Nombre del doctor (de doctors.name)
  areaName?: string;    // Nombre del área (de areas.name)
  specialty?: string;   // Especialidad del doctor (de doctors.specialty)
}
