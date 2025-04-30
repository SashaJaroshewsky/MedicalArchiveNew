// src/api/medical-certificates.api.ts
import api from './api';
import { 
  MedicalCertificate, 
  MedicalCertificateCreateRequest, 
  MedicalCertificateUpdateRequest 
} from '../models/medical-certificate.model';

const MedicalCertificatesAPI = {
  getAllCertificates: async (): Promise<MedicalCertificate[]> => {
    const response = await api.get<MedicalCertificate[]>('/MedicalCertificates');
    return response.data;
  },

  getCertificateById: async (id: number): Promise<MedicalCertificate> => {
    const response = await api.get<MedicalCertificate>(`/MedicalCertificates/${id}`);
    return response.data;
  },

  searchCertificates: async (term: string): Promise<MedicalCertificate[]> => {
    const response = await api.get<MedicalCertificate[]>('/MedicalCertificates/search', {
      params: { term }
    });
    return response.data;
  },

  getCertificatesByDateRange: async (startDate: string, endDate: string): Promise<MedicalCertificate[]> => {
    const response = await api.get<MedicalCertificate[]>('/MedicalCertificates/date-range', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  createCertificate: async (certificateData: MedicalCertificateCreateRequest): Promise<MedicalCertificate> => {
    const formData = new FormData();
    
    Object.entries(certificateData).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append('document', value);
      } else {
        formData.append(key, value.toString());
      }
    });
    
    const response = await api.post<MedicalCertificate>('/MedicalCertificates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateCertificate: async (id: number, certificateData: MedicalCertificateUpdateRequest): Promise<MedicalCertificate> => {
    const formData = new FormData();
    
    Object.entries(certificateData).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append('document', value);
      } else {
        formData.append(key, value.toString());
      }
    });
    
    const response = await api.put<MedicalCertificate>(`/MedicalCertificates/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteCertificate: async (id: number): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>(`/MedicalCertificates/${id}`);
    return response.data;
  },

  // Doctor-specific endpoints
  getPatientCertificates: async (patientId: number): Promise<MedicalCertificate[]> => {
    const response = await api.get<MedicalCertificate[]>(`/MedicalCertificates/patient/${patientId}`);
    return response.data;
  },

  getPatientCertificateById: async (patientId: number, certificateId: number): Promise<MedicalCertificate> => {
    const response = await api.get<MedicalCertificate>(`/MedicalCertificates/patient/${patientId}/${certificateId}`);
    return response.data;
  }
};

export default MedicalCertificatesAPI;