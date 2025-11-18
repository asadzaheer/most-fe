/**
 * API Service
 * Service layer for all API calls with typed interfaces
 */

import { apiRequest } from './api-client';
import { API_ENDPOINTS } from './api-config';

// ============================================
// Type Definitions
// ============================================

export type UserRole = 'ordinary' | 'children' | 'elderly' | 'anonymous' | null;

export interface SignUpRequest {
  name: string;
  birthDate: string;
  phoneNumber: string;
  password: string;
}

export interface SignInRequest {
  phoneNumber: string;
  password: string;
}

export interface SignUpResponse {
  id: string;
  name: string;
  birthDate: string;
  phoneNumber: string;
  isPhoneVerified: boolean;
  status: string;
  role: UserRole;
  createdAt: string;
}

export interface SignInResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface GetCodeRequest {
  phoneNumber: string;
}

export interface GetCodeResponse {
  success: boolean;
  message: string;
}

export interface VerifyCodeRequest {
  phoneNumber: string;
  code: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  token?: string;
  message: string;
}

// ============================================
// Ticket Types
// ============================================

export type TicketStatus = 'WAITING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface CreateTicketResponse {
  status: TicketStatus;
  createdAt: string;
}

// ============================================
// Authentication Services
// ============================================

export const authService = {
  signUp: async (data: SignUpRequest): Promise<SignUpResponse> => {
    return apiRequest.post(API_ENDPOINTS.auth.signUp, data);
  },

  signIn: async (data: SignInRequest): Promise<SignInResponse> => {
    return apiRequest.post(API_ENDPOINTS.auth.signIn, data);
  },
};

export const verificationService = {
  getCode: async (data: GetCodeRequest): Promise<GetCodeResponse> => {
    return apiRequest.post(API_ENDPOINTS.verify.getCode, data);
  },

  verifyCode: async (data: VerifyCodeRequest): Promise<VerifyCodeResponse> => {
    return apiRequest.post(API_ENDPOINTS.verify.verifyCode, data);
  },
};

// ============================================
// Ticket Services
// ============================================

export const ticketService = {
  create: async (): Promise<CreateTicketResponse> => {
    return apiRequest.post(API_ENDPOINTS.tickets.create, {});
  },

  updateStatus: async (): Promise<void> => {
    return apiRequest.patch(API_ENDPOINTS.tickets.updateStatus);
  },

  delete: async (): Promise<void> => {
    return apiRequest.delete(API_ENDPOINTS.tickets.delete);
  },
};
