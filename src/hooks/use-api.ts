/**
 * React Query Hooks for API calls
 * Custom hooks using @tanstack/react-query for data fetching and mutations
 */

import { useMutation } from '@tanstack/react-query';
import {
  authService,
  verificationService,
  ticketService,
  SignUpRequest,
  SignInRequest,
  GetCodeRequest,
  VerifyCodeRequest,
} from '@/lib/api-service';

// ============================================
// Authentication Hooks
// ============================================

export const useSignUp = () => {
  return useMutation({
    mutationFn: (data: SignUpRequest) => authService.signUp(data),
  });
};

export const useSignIn = () => {
  return useMutation({
    mutationFn: (data: SignInRequest) => authService.signIn(data),
    onSuccess: (data) => {
      // Store auth token if provided
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
    },
  });
};


export const useGetCode = () => {
  return useMutation({
    mutationFn: (data: GetCodeRequest) => verificationService.getCode(data),
  });
};

export const useVerifyCode = () => {
  return useMutation({
    mutationFn: (data: VerifyCodeRequest) => verificationService.verifyCode(data),
  });
};

// ============================================
// Ticket Hooks
// ============================================

export const useCreateTicket = () => {
  return useMutation({
    mutationFn: () => ticketService.create(),
  });
};

export const useUpdateTicketStatus = () => {
  return useMutation({
    mutationFn: () => ticketService.updateStatus(),
  });
};

export const useDeleteTicket = () => {
  return useMutation({
    mutationFn: () => ticketService.delete(),
  });
};
