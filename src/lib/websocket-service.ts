/**
 * WebSocket Service
 * Handles STOMP over SockJS connection for real-time ticket updates
 */

import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

// WebSocket URL from environment
export const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

export interface TicketUpdate {
  status: 'WAITING' | 'CALLED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  queuePosition: number;
  waitingTime: number;
  createdAt: string;
}

export type TicketUpdateCallback = (update: TicketUpdate) => void;
export type ConnectionCallback = (connected: boolean) => void;
export type ErrorCallback = (error: string) => void;

class WebSocketService {
  private client: Client | null = null;
  private ticketUpdateCallbacks: TicketUpdateCallback[] = [];
  private connectionCallbacks: ConnectionCallback[] = [];
  private errorCallbacks: ErrorCallback[] = [];
  private isConnected = false;
  private reconnectDelay = 3000;

  /**
   * Connect to WebSocket server with JWT token
   */
  connect(token: string): void {
    if (this.client?.connected) {
      console.log('WebSocket already connected');
      return;
    }

    const wsUrl = `${WS_URL}?token=${token}`;

    this.client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      debug: (str: string) => {
        console.log('[STOMP]', str);
      },
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.notifyConnectionChange(true);
        this.subscribeToTickets();
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.notifyConnectionChange(false);
      },
      onStompError: (frame: { headers: Record<string, string> }) => {
        console.error('STOMP error:', frame.headers['message']);
        this.notifyError(frame.headers['message'] || 'Connection error');
      },
      onWebSocketError: (event: Event) => {
        console.error('WebSocket error:', event);
        this.notifyError('WebSocket connection error');
      },
    });

    this.client.activate();
  }

  /**
   * Subscribe to personal ticket updates
   */
  private subscribeToTickets(): void {
    if (!this.client?.connected) {
      console.error('Cannot subscribe: not connected');
      return;
    }

    // Subscribe to user-specific ticket queue
    this.client.subscribe('/user/queue/tickets', (message: IMessage) => {
      try {
        const update: TicketUpdate = JSON.parse(message.body);
        console.log('Received ticket update:', update);
        this.notifyTicketUpdate(update);
      } catch (error) {
        console.error('Error parsing ticket update:', error);
      }
    });

    console.log('Subscribed to /user/queue/tickets');
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.isConnected = false;
      this.notifyConnectionChange(false);
      console.log('WebSocket disconnected');
    }
  }

  /**
   * Check if connected
   */
  getIsConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Register callback for ticket updates
   */
  onTicketUpdate(callback: TicketUpdateCallback): () => void {
    this.ticketUpdateCallbacks.push(callback);
    return () => {
      this.ticketUpdateCallbacks = this.ticketUpdateCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Register callback for connection state changes
   */
  onConnectionChange(callback: ConnectionCallback): () => void {
    this.connectionCallbacks.push(callback);
    return () => {
      this.connectionCallbacks = this.connectionCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Register callback for errors
   */
  onError(callback: ErrorCallback): () => void {
    this.errorCallbacks.push(callback);
    return () => {
      this.errorCallbacks = this.errorCallbacks.filter(cb => cb !== callback);
    };
  }

  private notifyTicketUpdate(update: TicketUpdate): void {
    this.ticketUpdateCallbacks.forEach(callback => callback(update));
  }

  private notifyConnectionChange(connected: boolean): void {
    this.connectionCallbacks.forEach(callback => callback(connected));
  }

  private notifyError(error: string): void {
    this.errorCallbacks.forEach(callback => callback(error));
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();
