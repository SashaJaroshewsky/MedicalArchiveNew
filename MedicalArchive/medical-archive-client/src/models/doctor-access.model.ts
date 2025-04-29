// src/models/doctor-access.model.ts
import { User } from './user.model';

export interface DoctorAccess {
    id: number;
    userId: number;
    doctorId: number;
    grantedDate: string;
    user?: User;
    doctor?: User;
  }
  
  export interface DoctorAccessCreateRequest {
    doctorEmail: string;
  }