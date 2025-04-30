// src/api/referrals.api.ts
import api from './api';
import { 
  Referral, 
  ReferralCreateRequest, 
  ReferralUpdateRequest 
} from '../models/referral.model';

const ReferralsAPI = {
  getAllReferrals: async (): Promise<Referral[]> => {
    const response = await api.get<Referral[]>('/referrals');
    return response.data;
  },

  getReferralById: async (id: number): Promise<Referral> => {
    const response = await api.get<Referral>(`/referrals/${id}`);
    return response.data;
  },

  searchReferrals: async (term: string): Promise<Referral[]> => {
    const response = await api.get<Referral[]>(`/referrals/search?term=${term}`);
    return response.data;
  },

  getReferralsByDateRange: async (startDate: string, endDate: string): Promise<Referral[]> => {
    const response = await api.get<Referral[]>(
      `/referrals/date-range?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  },

  createReferral: async (referralData: ReferralCreateRequest): Promise<Referral> => {
    const formData = new FormData();
    
    // Додаємо всі текстові поля до formData
    Object.entries(referralData).forEach(([key, value]) => {
      if (key !== 'document') {
        formData.append(key, value);
      }
    });
    
    // Додаємо файл, якщо він є
    if (referralData.document) {
      formData.append('document', referralData.document);
    }
    
    const response = await api.post<Referral>('/referrals', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateReferral: async (id: number, referralData: ReferralUpdateRequest): Promise<Referral> => {
    const formData = new FormData();
    
    // Додаємо всі текстові поля до formData
    Object.entries(referralData).forEach(([key, value]) => {
      if (key !== 'document') {
        formData.append(key, value);
      }
    });
    
    // Додаємо файл, якщо він є
    if (referralData.document) {
      formData.append('document', referralData.document);
    }
    
    const response = await api.put<Referral>(`/referrals/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteReferral: async (id: number): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>(`/referrals/${id}`);
    return response.data;
  },

  // Для лікарів - робота з даними пацієнтів
  getPatientReferrals: async (patientId: number): Promise<Referral[]> => {
    const response = await api.get<Referral[]>(`/referrals/patient/${patientId}`);
    return response.data;
  },

  getPatientReferralById: async (patientId: number, referralId: number): Promise<Referral> => {
    const response = await api.get<Referral>(`/referrals/patient/${patientId}/${referralId}`);
    return response.data;
  }
};

export default ReferralsAPI;