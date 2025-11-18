import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserRole, TicketStatus } from '@/lib/api-service';

/**
 * Ticket Information Interface
 * Represents the user's current ticket in the queue
 */
export interface Ticket {
  status: TicketStatus;
  createdAt: string;
}

/**
 * User Session Interface
 * Represents the authenticated user's data
 */
export interface User {
  phone: string;
  birthDate?: string;
  role?: UserRole;
  isPhoneVerified?: boolean;
  createdAt?: string;
  ticket?: Ticket | null;
}

/**
 * Auth Store State Interface
 */
interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (token: string, user: Partial<User>) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setToken: (token: string) => void;
  setTicket: (ticket: Ticket | null) => void;
  clearTicket: () => void;
  
  // Utility
  initialize: () => void;
}

/**
 * User Authentication Store
 * 
 * Manages user session, authentication state, and persists data to localStorage.
 * 
 * Features:
 * - Automatic localStorage persistence
 * - Type-safe user data
 * - Authentication state management
 * - Token management
 * 
 * Usage:
 * ```tsx
 * const { user, isAuthenticated, login, logout } = useAuthStore();
 * 
 * // Login
 * login(authToken, { id: '123', name: 'John', phone: '+1234567890' });
 * 
 * // Logout
 * logout();
 * 
 * // Update user data
 * updateUser({ name: 'Jane Doe' });
 * ```
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,

      /**
       * Login user and store authentication data
       * @param token - JWT authentication token
       * @param user - User data (partial, will be merged with existing)
       */
      login: (token: string, user: Partial<User>) => {
        const currentUser = get().user;
        const updatedUser: User = {
          phone: user.phone || currentUser?.phone || '',
          birthDate: user.birthDate || currentUser?.birthDate,
          role: user.role || currentUser?.role,
          isPhoneVerified: user.isPhoneVerified ?? currentUser?.isPhoneVerified,
          createdAt: user.createdAt || currentUser?.createdAt,
          ticket: user.ticket || currentUser?.ticket,
        };

        set({
          token,
          user: updatedUser,
          isAuthenticated: true,
        });
      },

      /**
       * Logout user and clear all authentication data
       */
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      /**
       * Update user data without changing authentication state
       * @param userData - Partial user data to update
       */
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;

        set({
          user: {
            ...currentUser,
            ...userData,
          },
        });
      },

      /**
       * Update authentication token
       * @param token - New JWT token
       */
      setToken: (token: string) => {
        set({ token });
      },

      /**
       * Set ticket for the current user
       * @param ticket - Ticket data
       */
      setTicket: (ticket: Ticket | null) => {
        const currentUser = get().user;
        if (!currentUser) return;

        set({
          user: {
            ...currentUser,
            ticket,
          },
        });
      },

      /**
       * Clear ticket for the current user
       */
      clearTicket: () => {
        const currentUser = get().user;
        if (!currentUser) return;

        set({
          user: {
            ...currentUser,
            ticket: null,
          },
        });
      },

      /**
       * Initialize store from localStorage
       * Called on app startup to restore session
       */
      initialize: () => {
        const state = get();
        // Validate stored data
        if (state.token && state.user) {
          set({ isAuthenticated: true });
        } else {
          set({ isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist these fields
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/**
 * Hook to get authentication status
 */
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);

/**
 * Hook to get current user
 */
export const useCurrentUser = () => useAuthStore((state) => state.user);

/**
 * Hook to get auth token
 */
export const useAuthToken = () => useAuthStore((state) => state.token);

/**
 * Hook to get user's ticket
 */
export const useTicket = () => useAuthStore((state) => state.user?.ticket || null);

/**
 * Hook to check if user has an active ticket
 */
export const useHasTicket = () => useAuthStore((state) => !!state.user?.ticket);
