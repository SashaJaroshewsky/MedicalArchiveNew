// src/api/doctor-appointments.api.ts
import api from './api';
import { 
  DoctorAppointment, 
  DoctorAppointmentCreateRequest, 
  DoctorAppointmentUpdateRequest 
} from '../models/doctor-appointment.model';

const DoctorAppointmentsAPI = {
  getAllAppointments: async (): Promise<DoctorAppointment[]> => {
    const response = await api.get<DoctorAppointment[]>('/DoctorAppointments');
    return response.data;
  },

  getAppointmentById: async (id: number): Promise<DoctorAppointment> => {
    const response = await api.get<DoctorAppointment>(`/DoctorAppointments/${id}`);
    return response.data;
  },

  searchAppointments: async (term: string): Promise<DoctorAppointment[]> => {
    const response = await api.get<DoctorAppointment[]>(`/DoctorAppointments/search`, {
      params: { term }
    });
    return response.data;
  },

  getAppointmentsByDateRange: async (startDate: string, endDate: string): Promise<DoctorAppointment[]> => {
    const response = await api.get<DoctorAppointment[]>(`/DoctorAppointments/date-range`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  createAppointment: async (appointmentData: DoctorAppointmentCreateRequest): Promise<DoctorAppointment> => {
    const formData = new FormData();
    
    Object.entries(appointmentData).forEach(([key, value]) => {
      if (key !== 'document') {
        formData.append(key, value.toString());
      }
    });
    
    if (appointmentData.document) {
      formData.append('document', appointmentData.document);
    }
    
    const response = await api.post<DoctorAppointment>('/DoctorAppointments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateAppointment: async (id: number, appointmentData: DoctorAppointmentUpdateRequest): Promise<DoctorAppointment> => {
    const formData = new FormData();
    
    Object.entries(appointmentData).forEach(([key, value]) => {
      if (key !== 'document') {
        formData.append(key, value.toString());
      }
    });
    
    if (appointmentData.document) {
      formData.append('document', appointmentData.document);
    }
    
    const response = await api.put<DoctorAppointment>(`/DoctorAppointments/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteAppointment: async (id: number): Promise<boolean> => {
    const response = await api.delete<{ success: boolean }>(`/DoctorAppointments/${id}`);
    return response.data.success;
  },

  // Doctor access to patient data
  getPatientAppointments: async (patientId: number): Promise<DoctorAppointment[]> => {
    const response = await api.get<DoctorAppointment[]>(`/DoctorAppointments/patient/${patientId}`);
    return response.data;
  },

  getPatientAppointmentById: async (patientId: number, appointmentId: number): Promise<DoctorAppointment> => {
    const response = await api.get<DoctorAppointment>(
      `/DoctorAppointments/patient/${patientId}/${appointmentId}`
    );
    return response.data;
  }
};

export default DoctorAppointmentsAPI;