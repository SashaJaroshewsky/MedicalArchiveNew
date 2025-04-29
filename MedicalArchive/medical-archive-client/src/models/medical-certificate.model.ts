// src/models/medical-certificate.model.ts
export interface MedicalCertificate {
    id: number;
    title: string;
    issueDate: string;
    description: string;
    userId: number;
    documentFilePath: string | null;
  }
  
  export interface MedicalCertificateCreateRequest {
    title: string;
    issueDate: string;
    description: string;
    document?: File;
  }
  
  export interface MedicalCertificateUpdateRequest {
    title: string;
    issueDate: string;
    description: string;
    document?: File;
  }