// src/api/auth.api.ts
import api from './api';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  ChangePasswordRequest 
} from '../models/auth.model';
import { User, UserUpdateRequest } from '../models/user.model';

const AuthAPI = {
  login: async (loginData: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', loginData);
    return response.data;
  },

  register: async (registerData: RegisterRequest): Promise<User> => {
    const response = await api.post<User>('/auth/register', registerData);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData: UserUpdateRequest): Promise<User> => {
    const response = await api.put<User>('/users/profile', profileData);
    return response.data;
  },

  changePassword: async (passwordData: ChangePasswordRequest): Promise<{ success: boolean }> => {
    const response = await api.post<{ success: boolean }>('/users/change-password', passwordData);
    return response.data;
  },

  deleteAccount: async (): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>('/users/delete-account');
    return response.data;
  }
};

export default AuthAPI;