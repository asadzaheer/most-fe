/**
 * WebSocket Hook
 * React hook for managing WebSocket connection and ticket updates
 */

import { useEffect, useState, useCallback } from 'react';
import { websocketService, TicketUpdate } from '@/lib/websocket-service';
import { useAuthStore } from '@/store/useAuthStore';

interface UseWebSocketReturn {
  isConnected: boolean;
  lastUpdate: TicketUpdate | null;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
}

export function useWebSocket(): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<TicketUpdate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);

  const connect = useCallback(() => {
    if (token) {
      setError(null);
      websocketService.connect(token);
    } else {
      setError('No authentication token available');
    }
  }, [token]);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
  }, []);

  useEffect(() => {
    // Subscribe to connection changes
    const unsubscribeConnection = websocketService.onConnectionChange((connected) => {
      setIsConnected(connected);
      if (connected) {
        setError(null);
      }
    });

    // Subscribe to ticket updates
    const unsubscribeTicket = websocketService.onTicketUpdate((update) => {
      setLastUpdate(update);
    });

    // Subscribe to errors
    const unsubscribeError = websocketService.onError((err) => {
      setError(err);
    });

    // Cleanup on unmount
    return () => {
      unsubscribeConnection();
      unsubscribeTicket();
      unsubscribeError();
    };
  }, []);

  // Auto-connect when token is available
  useEffect(() => {
    if (token && !isConnected) {
      connect();
    }

    // Disconnect when token is removed (logout)
    if (!token && isConnected) {
      disconnect();
    }
  }, [token, isConnected, connect, disconnect]);

  return {
    isConnected,
    lastUpdate,
    error,
    connect,
    disconnect,
  };
}

/**
 * Hook to get just the connection status
 */
export function useWebSocketStatus(): boolean {
  const [isConnected, setIsConnected] = useState(websocketService.getIsConnected());

  useEffect(() => {
    const unsubscribe = websocketService.onConnectionChange((connected) => {
      setIsConnected(connected);
    });

    return unsubscribe;
  }, []);

  return isConnected;
}
