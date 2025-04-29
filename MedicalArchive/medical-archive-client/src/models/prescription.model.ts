// src/models/prescription.model.ts
export interface Prescription {
    id: number;
    medicationName: string;
    issueDate: string;
    dosage: string;
    instructions: string;
    userId: number;
    documentFilePath: string | null;
  }
  
  export interface PrescriptionCreateRequest {
    medicationName: string;
    issueDate: string;
    dosage: string;
    instructions: string;
    document?: File;
  }
  
  export interface PrescriptionUpdateRequest {
    medicationName: string;
    issueDate: string;
    dosage: string;
    instructions: string;
    document?: File;
  }