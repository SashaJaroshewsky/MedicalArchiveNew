// src/models/referral.model.ts
export interface Referral {
    id: number;
    title: string;
    issueDate: string;
    expirationDate: string;
    referralType: string;
    referralNumber: string;
    userId: number;
    documentFilePath: string | null;
  }
  
  export interface ReferralCreateRequest {
    title: string;
    issueDate: string;
    expirationDate: string;
    referralType: string;
    referralNumber: string;
    document?: File;
  }
  
  export interface ReferralUpdateRequest {
    title: string;
    issueDate: string;
    expirationDate: string;
    referralType: string;
    referralNumber: string;
    document?: File;
  }