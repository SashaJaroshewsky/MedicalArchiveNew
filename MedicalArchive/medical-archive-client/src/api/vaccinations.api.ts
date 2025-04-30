// src/api/vaccinations.api.ts
import api from './api';
import { 
  Vaccination, 
  VaccinationCreateRequest, 
  VaccinationUpdateRequest 
} from '../models/vaccination.model';

const VaccinationsAPI = {
  getAllVaccinations: async (): Promise<Vaccination[]> => {
    const response = await api.get<Vaccination[]>('/vaccinations');
    return response.data;
  },

  getVaccinationById: async (id: number): Promise<Vaccination> => {
    const response = await api.get<Vaccination>(`/vaccinations/${id}`);
    return response.data;
  },

  searchVaccinations: async (term: string): Promise<Vaccination[]> => {
    const response = await api.get<Vaccination[]>(`/vaccinations/search?term=${term}`);
    return response.data;
  },

  getVaccinationsByDateRange: async (startDate: string, endDate: string): Promise<Vaccination[]> => {
    const response = await api.get<Vaccination[]>(
      `/vaccinations/date-range?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  },

  createVaccination: async (vaccinationData: VaccinationCreateRequest): Promise<Vaccination> => {
    const formData = new FormData();
    
    // Додаємо всі текстові поля до formData
    Object.entries(vaccinationData).forEach(([key, value]) => {
      if (key !== 'document') {
        formData.append(key, value);
      }
    });
    
    // Додаємо файл, якщо він є
    if (vaccinationData.document) {
      formData.append('document', vaccinationData.document);
    }
    
    const response = await api.post<Vaccination>('/vaccinations', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateVaccination: async (id: number, vaccinationData: VaccinationUpdateRequest): Promise<Vaccination> => {
    const formData = new FormData();
    
    // Додаємо всі текстові поля до formData
    Object.entries(vaccinationData).forEach(([key, value]) => {
      if (key !== 'document') {
        formData.append(key, value);
      }
    });
    
    // Додаємо файл, якщо він є
    if (vaccinationData.document) {
      formData.append('document', vaccinationData.document);
    }
    
    const response = await api.put<Vaccination>(`/vaccinations/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteVaccination: async (id: number): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>(`/vaccinations/${id}`);
    return response.data;
  },

  // Для лікарів - робота з даними пацієнтів
  getPatientVaccinations: async (patientId: number): Promise<Vaccination[]> => {
    const response = await api.get<Vaccination[]>(`/vaccinations/patient/${patientId}`);
    return response.data;
  },

  getPatientVaccinationById: async (patientId: number, vaccinationId: number): Promise<Vaccination> => {
    const response = await api.get<Vaccination>(`/vaccinations/patient/${patientId}/${vaccinationId}`);
    return response.data;
  }
};

export default VaccinationsAPI;