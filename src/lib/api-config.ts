/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

// Get the base URL from environment variables, with fallback
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    signUp: '/auth/sign-up',
    signIn: '/auth/sign-in',
    requestReset: '/auth/request-reset',
    reset: '/auth/reset',
  },

  verify: {
    getCode: '/verification/get-code',
    verifyCode: '/verification/verify-code',
  },

  tickets: {
    get: '/tickets',
    create: '/tickets',
    updateStatus: '/tickets',
    delete: '/tickets',
  }
} as const;

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000;

// Retry configuration
export const RETRY_CONFIG = {
  retries: 3,
  retryDelay: 1000,
};
