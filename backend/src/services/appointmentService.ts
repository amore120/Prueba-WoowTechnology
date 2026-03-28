/**
 * @file appointmentService.ts
 * @description Capa de servicio que encapsula toda la lógica de acceso a datos.
 *
 * Patrón: los controladores llaman a los servicios, los servicios acceden a la DB.
 * Esto separa la lógica HTTP de la lógica de negocio y facilita el testing.
 *
 * Nota sobre sql.js:
 *  - db.exec() → para SELECT (retorna array de resultados)
 *  - db.run()  → para INSERT / UPDATE / DELETE (no retorna filas)
 */

import { getDb, persistDb } from '../db/database';
import { v4 as uuidv4 } from 'uuid';
import {
  Area, CreateAreaDTO,
  Doctor, CreateDoctorDTO,
  Patient, CreatePatientDTO,
  Appointment, AppointmentView, AppointmentStatus,
  CreateAppointmentDTO, UpdateAppointmentDTO,
} from '../models/appointment';

// ─────────────────────────────────────────────
//  HELPER INTERNO
// ─────────────────────────────────────────────

/**
 * Convierte el formato de respuesta de sql.js (columnas + valores separados)
 * en un array de objetos tipados más fácil de manejar.
 *
 * sql.js retorna: [{ columns: ['id','name'], values: [['1','Ana'],['2','Luis']] }]
 * Esta función lo convierte en: [{ id:'1', name:'Ana' }, { id:'2', name:'Luis' }]
 *
 * @param result - Resultado crudo de db.exec()
 * @returns Array de objetos con los datos de las filas
 */
function rows<T>(result: any[]): T[] {
  if (!result.length) return [];
  const { columns, values } = result[0];
  return values.map((row: any[]) => {
    const obj: any = {};
    columns.forEach((col: string, i: number) => { obj[col] = row[i]; });
    return obj as T;
  });
}

// ══════════════════════════════════════════════════════
//  ÁREAS
// ══════════════════════════════════════════════════════

/** Retorna todas las áreas médicas ordenadas alfabéticamente */
export const getAllAreas = (): Area[] =>
  rows<Area>(getDb().exec('SELECT * FROM areas ORDER BY name ASC'));

/** Busca un área por su ID. Retorna undefined si no existe */
export const getAreaById = (id: string): Area | undefined =>
  rows<Area>(getDb().exec('SELECT * FROM areas WHERE id = ?', [id]))[0];

/**
 * Crea una nueva área médica con ID autogenerado y timestamp de creación.
 * Persiste inmediatamente en disco.
 */
export const createArea = (data: CreateAreaDTO): Area => {
  const item: Area = {
    id: uuidv4(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  getDb().run(
    'INSERT INTO areas (id, name, description, color, createdAt) VALUES (?, ?, ?, ?, ?)',
    [item.id, item.name, item.description ?? null, item.color, item.createdAt]
  );
  persistDb();
  return item;
};

/** Actualiza los campos de un área existente. Retorna null si no se encuentra */
export const updateArea = (id: string, data: Partial<CreateAreaDTO>): Area | null => {
  const existing = getAreaById(id);
  if (!existing) return null;
  const updated = { ...existing, ...data };
  getDb().run(
    'UPDATE areas SET name = ?, description = ?, color = ? WHERE id = ?',
    [updated.name, updated.description ?? null, updated.color, id]
  );
  persistDb();
  return updated;
};

/** Elimina un área por ID. Retorna false si no existía */
export const deleteArea = (id: string): boolean => {
  if (!getAreaById(id)) return false;
  getDb().run('DELETE FROM areas WHERE id = ?', [id]);
  persistDb();
  return true;
};

// ══════════════════════════════════════════════════════
//  DOCTORES
// ══════════════════════════════════════════════════════

/** Retorna todos los doctores ordenados por nombre */
export const getAllDoctors = (): Doctor[] =>
  rows<Doctor>(getDb().exec('SELECT * FROM doctors ORDER BY name ASC'));

/** Busca un doctor por ID. Retorna undefined si no existe */
export const getDoctorById = (id: string): Doctor | undefined =>
  rows<Doctor>(getDb().exec('SELECT * FROM doctors WHERE id = ?', [id]))[0];

/**
 * Registra un nuevo doctor. Estado por defecto: 'activo'.
 * Persiste en disco automáticamente.
 */
export const createDoctor = (data: CreateDoctorDTO): Doctor => {
  const item: Doctor = {
    id: uuidv4(),
    ...data,
    status: data.status ?? 'activo',
    createdAt: new Date().toISOString(),
  };
  getDb().run(
    'INSERT INTO doctors (id, name, specialty, areaId, phone, email, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [item.id, item.name, item.specialty, item.areaId ?? null,
     item.phone ?? null, item.email ?? null, item.status, item.createdAt]
  );
  persistDb();
  return item;
};

/** Actualiza los datos de un doctor existente */
export const updateDoctor = (id: string, data: Partial<CreateDoctorDTO>): Doctor | null => {
  const existing = getDoctorById(id);
  if (!existing) return null;
  const updated = { ...existing, ...data };
  getDb().run(
    'UPDATE doctors SET name = ?, specialty = ?, areaId = ?, phone = ?, email = ?, status = ? WHERE id = ?',
    [updated.name, updated.specialty, updated.areaId ?? null,
     updated.phone ?? null, updated.email ?? null, updated.status, id]
  );
  persistDb();
  return updated;
};

/** Elimina un doctor por ID */
export const deleteDoctor = (id: string): boolean => {
  if (!getDoctorById(id)) return false;
  getDb().run('DELETE FROM doctors WHERE id = ?', [id]);
  persistDb();
  return true;
};

// ══════════════════════════════════════════════════════
//  PACIENTES
// ══════════════════════════════════════════════════════

/** Retorna todos los pacientes ordenados por nombre */
export const getAllPatients = (): Patient[] =>
  rows<Patient>(getDb().exec('SELECT * FROM patients ORDER BY name ASC'));

/** Busca un paciente por ID */
export const getPatientById = (id: string): Patient | undefined =>
  rows<Patient>(getDb().exec('SELECT * FROM patients WHERE id = ?', [id]))[0];

/** Registra un nuevo paciente con todos sus datos personales */
export const createPatient = (data: CreatePatientDTO): Patient => {
  const item: Patient = { id: uuidv4(), ...data, createdAt: new Date().toISOString() };
  getDb().run(
    'INSERT INTO patients (id, name, dni, phone, email, birthDate, gender, address, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [item.id, item.name, item.dni ?? null, item.phone ?? null, item.email ?? null,
     item.birthDate ?? null, item.gender ?? null, item.address ?? null, item.createdAt]
  );
  persistDb();
  return item;
};

/** Actualiza los datos personales de un paciente */
export const updatePatient = (id: string, data: Partial<CreatePatientDTO>): Patient | null => {
  const existing = getPatientById(id);
  if (!existing) return null;
  const updated = { ...existing, ...data };
  getDb().run(
    'UPDATE patients SET name = ?, dni = ?, phone = ?, email = ?, birthDate = ?, gender = ?, address = ? WHERE id = ?',
    [updated.name, updated.dni ?? null, updated.phone ?? null, updated.email ?? null,
     updated.birthDate ?? null, updated.gender ?? null, updated.address ?? null, id]
  );
  persistDb();
  return updated;
};

/** Elimina un paciente del sistema */
export const deletePatient = (id: string): boolean => {
  if (!getPatientById(id)) return false;
  getDb().run('DELETE FROM patients WHERE id = ?', [id]);
  persistDb();
  return true;
};

// ══════════════════════════════════════════════════════
//  CITAS MÉDICAS
// ══════════════════════════════════════════════════════

/**
 * Query SQL base para obtener citas con datos de relaciones resueltos (JOIN).
 * Incluye nombre de paciente, doctor, área y especialidad del médico.
 */
const VIEW_SQL = `
  SELECT
    a.*,
    p.name  AS patientName,
    d.name  AS doctorName,
    ar.name AS areaName,
    d.specialty
  FROM appointments a
  LEFT JOIN patients p  ON a.patientId = p.id
  LEFT JOIN doctors  d  ON a.doctorId  = d.id
  LEFT JOIN areas    ar ON a.areaId    = ar.id
`;

/** Retorna todas las citas enriquecidas con datos de relaciones, ordenadas por fecha de creación */
export const getAllAppointments = (): AppointmentView[] =>
  rows<AppointmentView>(getDb().exec(VIEW_SQL + ' ORDER BY a.createdAt DESC'));

/** Busca una cita por ID con todos sus datos relacionados */
export const getAppointmentById = (id: string): AppointmentView | undefined =>
  rows<AppointmentView>(getDb().exec(VIEW_SQL + ' WHERE a.id = ?', [id]))[0];

/**
 * Crea una nueva cita médica.
 * El estado inicial siempre es 'pendiente'.
 */
export const createAppointment = (data: CreateAppointmentDTO): Appointment => {
  const item: Appointment = {
    id: uuidv4(),
    ...data,
    status: 'pendiente',
    createdAt: new Date().toISOString(),
  };
  getDb().run(
    'INSERT INTO appointments (id, patientId, doctorId, areaId, appointmentDate, reason, status, notes, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [item.id, item.patientId, item.doctorId, item.areaId ?? null,
     item.appointmentDate, item.reason, item.status, item.notes ?? null, item.createdAt]
  );
  persistDb();
  return item;
};

/** Actualiza los datos de una cita existente (no cambia el estado — usar updateAppointmentStatus) */
export const updateAppointment = (id: string, data: UpdateAppointmentDTO): AppointmentView | null => {
  const existing = getAppointmentById(id);
  if (!existing) return null;
  const updated = { ...existing, ...data };
  getDb().run(
    'UPDATE appointments SET patientId = ?, doctorId = ?, areaId = ?, appointmentDate = ?, reason = ?, notes = ? WHERE id = ?',
    [updated.patientId, updated.doctorId, updated.areaId ?? null,
     updated.appointmentDate, updated.reason, updated.notes ?? null, id]
  );
  persistDb();
  // Retornamos la versión enriquecida actualizada
  return getAppointmentById(id) ?? null;
};

/**
 * Cambia únicamente el estado de una cita.
 * Endpoint dedicado: PATCH /appointments/:id/status
 */
export const updateAppointmentStatus = (id: string, status: AppointmentStatus): AppointmentView | null => {
  const existing = getAppointmentById(id);
  if (!existing) return null;
  getDb().run('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
  persistDb();
  return { ...existing, status };
};

/** Elimina una cita del sistema */
export const deleteAppointment = (id: string): boolean => {
  if (!getAppointmentById(id)) return false;
  getDb().run('DELETE FROM appointments WHERE id = ?', [id]);
  persistDb();
  return true;
};

// ══════════════════════════════════════════════════════
//  ESTADÍSTICAS GLOBALES
// ══════════════════════════════════════════════════════

/**
 * Agrega métricas globales del sistema consultando cada tabla.
 * Usado por el endpoint GET /stats para alimentar el Dashboard.
 */
export const getStats = () => {
  const db = getDb();

  // Helper local para extraer el conteo de una query COUNT
  const count = (sql: string): number =>
    rows<{ n: number }>(db.exec(sql))[0]?.n ?? 0;

  return {
    total:     count('SELECT COUNT(*) as n FROM appointments'),
    pending:   count("SELECT COUNT(*) as n FROM appointments WHERE status = 'pendiente'"),
    confirmed: count("SELECT COUNT(*) as n FROM appointments WHERE status = 'confirmada'"),
    cancelled: count("SELECT COUNT(*) as n FROM appointments WHERE status = 'cancelada'"),
    completed: count("SELECT COUNT(*) as n FROM appointments WHERE status = 'completada'"),
    patients:  count('SELECT COUNT(*) as n FROM patients'),
    doctors:   count('SELECT COUNT(*) as n FROM doctors'),
    areas:     count('SELECT COUNT(*) as n FROM areas'),
  };
};
