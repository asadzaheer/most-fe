/**
 * Store Index
 * Central export point for all Zustand stores
 */

export { 
  useAuthStore, 
  useIsAuthenticated, 
  useCurrentUser, 
  useAuthToken,
  useTicket,
  useHasTicket
} from './useAuthStore';
export type { User, Ticket } from './useAuthStore';

import { useAuthStore } from './useAuthStore';

/**
 * Initialize all stores
 * Call this function on app startup to restore persisted state
 */
export const initializeStores = () => {
  // Initialize auth store
  useAuthStore.getState().initialize();
};
