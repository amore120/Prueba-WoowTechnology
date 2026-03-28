export type AppointmentStatus = 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
export type DoctorStatus = 'activo' | 'inactivo';
export type Gender = 'masculino' | 'femenino' | 'otro';

export interface Area {
  id: string; name: string; description?: string; color: string; createdAt: string;
}
export type CreateAreaDTO = Omit<Area, 'id' | 'createdAt'>;

export interface Doctor {
  id: string; name: string; specialty: string; areaId?: string;
  phone?: string; email?: string; status: DoctorStatus; createdAt: string;
}
export type CreateDoctorDTO = Omit<Doctor, 'id' | 'createdAt'>;

export interface Patient {
  id: string; name: string; dni?: string; phone?: string; email?: string;
  birthDate?: string; gender?: Gender; address?: string; createdAt: string;
}
export type CreatePatientDTO = Omit<Patient, 'id' | 'createdAt'>;

export interface AppointmentView {
  id: string; patientId: string; doctorId: string; areaId?: string;
  appointmentDate: string; reason: string; status: AppointmentStatus;
  notes?: string; createdAt: string;
  patientName: string; doctorName: string; areaName?: string; specialty?: string;
}
export type CreateAppointmentDTO = {
  patientId: string; doctorId: string; areaId?: string;
  appointmentDate: string; reason: string; notes?: string;
};

export interface Stats {
  total: number; pending: number; confirmed: number; cancelled: number;
  completed: number; patients: number; doctors: number; areas: number;
}
