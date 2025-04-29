// src/api/prescriptions.api.ts
import api from './api';
import { 
  Prescription, 
  PrescriptionCreateRequest, 
  PrescriptionUpdateRequest 
} from '../models/prescription.model';

const PrescriptionsAPI = {
  getAllPrescriptions: async (): Promise<Prescription[]> => {
    const response = await api.get<Prescription[]>('/prescriptions');
    return response.data;
  },

  getPrescriptionById: async (id: number): Promise<Prescription> => {
    const response = await api.get<Prescription>(`/prescriptions/${id}`);
    return response.data;
  },

  searchPrescriptions: async (term: string): Promise<Prescription[]> => {
    const response = await api.get<Prescription[]>(`/prescriptions/search?term=${term}`);
    return response.data;
  },

  getPrescriptionsByDateRange: async (startDate: string, endDate: string): Promise<Prescription[]> => {
    const response = await api.get<Prescription[]>(
      `/prescriptions/date-range?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  },

  createPrescription: async (prescriptionData: PrescriptionCreateRequest): Promise<Prescription> => {
    const formData = new FormData();
    
    // Додаємо всі текстові поля до formData
    Object.entries(prescriptionData).forEach(([key, value]) => {
      if (key !== 'document') {
        formData.append(key, value);
      }
    });
    
    // Додаємо файл, якщо він є
    if (prescriptionData.document) {
      formData.append('document', prescriptionData.document);
    }
    
    const response = await api.post<Prescription>('/prescriptions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updatePrescription: async (id: number, prescriptionData: PrescriptionUpdateRequest): Promise<Prescription> => {
    const formData = new FormData();
    
    // Додаємо всі текстові поля до formData
    Object.entries(prescriptionData).forEach(([key, value]) => {
      if (key !== 'document') {
        formData.append(key, value);
      }
    });
    
    // Додаємо файл, якщо він є
    if (prescriptionData.document) {
      formData.append('document', prescriptionData.document);
    }
    
    const response = await api.put<Prescription>(`/prescriptions/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deletePrescription: async (id: number): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>(`/prescriptions/${id}`);
    return response.data;
  },

  // Для лікарів - робота з даними пацієнтів
  getPatientPrescriptions: async (patientId: number): Promise<Prescription[]> => {
    const response = await api.get<Prescription[]>(`/prescriptions/patient/${patientId}`);
    return response.data;
  },

  getPatientPrescriptionById: async (patientId: number, prescriptionId: number): Promise<Prescription> => {
    const response = await api.get<Prescription>(`/prescriptions/patient/${patientId}/${prescriptionId}`);
    return response.data;
  }
};

export default PrescriptionsAPI;