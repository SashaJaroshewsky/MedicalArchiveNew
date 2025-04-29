// src/models/vaccination.model.ts
export interface Vaccination {
    id: number;
    vaccineName: string;
    vaccinationDate: string;
    manufacturer: string;
    doseNumber: string;
    userId: number;
    documentFilePath: string | null;
  }
  
  export interface VaccinationCreateRequest {
    vaccineName: string;
    vaccinationDate: string;
    manufacturer: string;
    doseNumber: string;
    document?: File;
  }
  
  export interface VaccinationUpdateRequest {
    vaccineName: string;
    vaccinationDate: string;
    manufacturer: string;
    doseNumber: string;
    document?: File;
  }