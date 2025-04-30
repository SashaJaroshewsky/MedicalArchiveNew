// src/api/doctor-access.api.ts
import api from './api';
import { DoctorAccess, DoctorAccessCreateRequest } from '../models/doctor-access.model';
import { User } from '../models/user.model';

const DoctorAccessAPI = {
  // Get doctors who have access to current user's data
  getDoctorsWithAccess: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/DoctorAccess/doctors');
    return response.data;
  },

  // For doctors - get patients who granted access to their data
  getPatientsWithAccess: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/DoctorAccess/patients');
    return response.data;
  },

  // Grant access to a doctor by their email
  grantAccess: async (accessData: DoctorAccessCreateRequest): Promise<DoctorAccess> => {
    const response = await api.post<DoctorAccess>('/DoctorAccess/grant', accessData);
    return response.data;
  },

  // Revoke doctor's access
  revokeAccess: async (doctorId: number): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>(`/DoctorAccess/revoke/${doctorId}`);
    return response.data;
  }
};

export default DoctorAccessAPI;