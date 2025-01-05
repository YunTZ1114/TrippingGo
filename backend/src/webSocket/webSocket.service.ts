import { Injectable, Logger, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from 'src/config';
import { NamespaceType } from 'src/types/webSocket.type';

@Injectable()
export class WebSocketService implements OnModuleInit, OnApplicationShutdown {
  private sockets: Map<NamespaceType, Socket> = new Map();
  private readonly logger = new Logger(WebSocketService.name);

  constructor() {
    Object.values(NamespaceType).forEach((namespace) => {
      const socket = io(`${SOCKET_URL}${namespace}`, {
        transports: ['websocket'],
        reconnection: true,
        autoConnect: false,
        query: {
          type: 'API_SERVER',
        },
      });

      this.setupListeners(socket, namespace);
      this.sockets.set(namespace as NamespaceType, socket);
    });
  }

  private setupListeners(socket: Socket, namespace: string) {
    socket.on('connect', () => {
      this.logger.log(`Connected to WebSocket server namespace: ${namespace}`);
    });

    socket.on('disconnect', () => {
      this.logger.warn(`Disconnected from WebSocket server namespace: ${namespace}`);
    });

    socket.on('connect_error', (error) => {
      this.logger.error(`Connection error in namespace ${namespace}:`, error.message);
    });

    socket.on('error', (error) => {
      this.logger.error(`WebSocket error in namespace ${namespace}:`, error);
    });
  }

  async onModuleInit() {
    this.logger.log('WebSocket Service initializing...');
    const connectPromises = Array.from(this.sockets.entries()).map(([namespace, socket]) => this.connectToNamespace(socket, namespace));

    await Promise.all(connectPromises);
    this.logger.log('WebSocket Service initialized');
  }

  private async connectToNamespace(socket: Socket, namespace: string): Promise<void> {
    try {
      socket.connect();

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error(`Connection timeout for namespace ${namespace}`));
        }, 5000);

        const connectHandler = () => {
          clearTimeout(timeout);
          resolve();
        };

        const errorHandler = (error: Error) => {
          clearTimeout(timeout);
          reject(error);
        };

        socket.once('connect', connectHandler);
        socket.once('connect_error', errorHandler);

        return () => {
          clearTimeout(timeout);
          socket.off('connect', connectHandler);
          socket.off('connect_error', errorHandler);
        };
      });

      this.logger.log(`Successfully connected to namespace: ${namespace}`);
    } catch (error) {
      this.logger.error(`Failed to connect to namespace ${namespace}:`, error.message);
    }
  }

  async emitToRoom(tripId: number, event: string, data: any, namespace: NamespaceType = NamespaceType.TripMembers) {
    const socket = this.sockets.get(namespace);
    if (!socket?.connected) {
      throw new Error(`Socket for namespace ${namespace} is not connected`);
    }

    try {
      socket.emit('emitToRoom', { roomId: tripId, event, data });
      this.logger.log(`Emitted ${event} to room ${tripId} in namespace ${namespace}`);
    } catch (error) {
      this.logger.error(`Error emitting to room: ${error.message}`);
      throw error;
    }
  }

  async emitToMembers(
    tripId: number,
    event: string,
    data: Array<{
      tripMemberId: number;
      data: any;
    }>,
    namespace: NamespaceType = NamespaceType.Checklists,
  ) {
    const socket = this.sockets.get(namespace);
    if (!socket?.connected) {
      throw new Error(`Socket for namespace ${namespace} is not connected`);
    }

    try {
      socket.emit('emitToMembers', { roomId: tripId, event, data });
      this.logger.log(`Emitted ${event} to room ${tripId} in namespace ${namespace}`);
    } catch (error) {
      this.logger.error(`Error emitting to room: ${error.message}`);
      throw error;
    }
  }

  async disconnectClient(tripId: number, clientId: string, namespace: NamespaceType = NamespaceType.TripMembers) {
    const socket = this.sockets.get(namespace);
    if (!socket?.connected) {
      throw new Error(`Socket for namespace ${namespace} is not connected`);
    }

    try {
      socket.emit('disconnectClient', { roomId: tripId, clientId });
      this.logger.log(`Requested disconnect for client ${clientId} in trip ${tripId} namespace ${namespace}`);
    } catch (error) {
      this.logger.error(`Error requesting client disconnect: ${error.message}`);
      throw error;
    }
  }

  async onApplicationShutdown() {
    for (const [namespace, socket] of this.sockets.entries()) {
      if (socket.connected) {
        socket.disconnect();
        this.logger.log(`Closed connection to namespace: ${namespace}`);
      }
    }
  }
}
