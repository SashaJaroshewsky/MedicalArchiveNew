// src/models/auth.model.ts
export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface RegisterRequest {
    firstName: string;
    lastName: string;
    middleName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    phoneNumber: string;
    address: string;
    password: string;
    role: string;
  }
  
  export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
  }
  
  export interface AuthResponse {
    accessToken: string;
    userEmail: string;
    userRole: string;
    userId: number;
  }
  
  // src/models/user.model.ts
  export interface User {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    phoneNumber: string;
    address: string;
    role: string;
  }
  
  export interface UserUpdateRequest {
    firstName: string;
    lastName: string;
    middleName: string;
    dateOfBirth: string;
    gender: string;
    phoneNumber: string;
    address: string;
  }