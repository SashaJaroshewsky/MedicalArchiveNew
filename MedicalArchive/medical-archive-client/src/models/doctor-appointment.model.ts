// src/models/doctor-appointment.model.ts
export interface DoctorAppointment {
    id: number;
    title: string;
    appointmentDate: string;
    doctorName: string;
    complaints: string;
    procedureDescription: string;
    diagnosis: string;
    userId: number;
    documentFilePath: string | null;
  }
  
  export interface DoctorAppointmentCreateRequest {
    title: string;
    appointmentDate: string;
    doctorName: string;
    complaints: string;
    procedureDescription: string;
    diagnosis: string;
    document?: File;
  }
  
  export interface DoctorAppointmentUpdateRequest {
    title: string;
    appointmentDate: string;
    doctorName: string;
    complaints: string;
    procedureDescription: string;
    diagnosis: string;
    document?: File;
  }