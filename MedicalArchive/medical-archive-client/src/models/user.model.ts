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