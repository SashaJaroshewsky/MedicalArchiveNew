// src/api/doctor-access.api.ts
import api from './api';
import { DoctorAccess, DoctorAccessCreateRequest } from '../models/doctor-access.model';
import { User } from '../models/user.model';

const DoctorAccessAPI = {
  getDoctorsWithAccess: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/doctor-access/doctors');
    return response.data;
  },

  getPatientsWithAccess: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/doctor-access/patients');
    return response.data;
  },

  grantAccess: async (accessData: DoctorAccessCreateRequest): Promise<DoctorAccess> => {
    const response = await api.post<DoctorAccess>('/doctor-access/grant', accessData);
    return response.data;
  },

  revokeAccess: async (doctorId: number): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>(`/doctor-access/revoke/${doctorId}`);
    return response.data;
  }
};

export default DoctorAccessAPI;