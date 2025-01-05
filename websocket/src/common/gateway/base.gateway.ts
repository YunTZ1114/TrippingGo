import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { HttpService } from '@nestjs/axios';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { API_URL } from 'src/config';

enum ClientType {
  ApiServer = 'API_SERVER',
  ClientUser = 'CLIENT_USER',
}

interface ConnectedClient {
  roomId?: string;
  token: string;
  type: ClientType;
  tripMemberId?: string;
}

export abstract class BaseGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  protected abstract onClientJoinRoom(
    client: Socket,
    token: string,
    roomId: string,
    tripMemberId?: string,
  ): Promise<void>;

  protected readonly logger: Logger;
  private connectedClients: Map<string, ConnectedClient> = new Map();
  private apiServerSocketId: string | null = null;

  constructor(
    protected readonly httpService: HttpService,
    protected readonly namespace: string,
  ) {
    this.logger = new Logger(`${namespace}Gateway`);
  }

  async handleConnection(client: Socket) {
    const address = client.handshake.address;
    const clientId = client.id;
    const roomId = client.handshake.query?.roomId as string;
    const token = client.handshake.headers?.authorization;
    const clientType = client.handshake.query.type as ClientType;
    const tripMemberId = client.handshake.query?.tripMemberId as string;

    this.logger.log(
      `Connection attempt to ${this.namespace} ${roomId} - Type: ${clientType}, ID: ${clientId}`,
    );

    const allowedIPs = '::1';
    if (address !== allowedIPs && address !== '::ffff:127.0.0.1') {
      client.emit('error', { message: 'Forbidden: Invalid IP address' });
      client.disconnect();
      this.logger.warn(`Forbidden IP: ${address}`);
      return;
    }

    try {
      if (clientType === ClientType.ApiServer) {
        await this.handleApiServerConnection(client);
        return;
      }

      await this.handleClientUserConnection(
        client,
        clientId,
        roomId,
        token,
        tripMemberId,
      );
    } catch (error) {
      this.handleConnectionError(client, error);
    }
  }

  protected async handleApiServerConnection(client: Socket) {
    if (this.apiServerSocketId) {
      const sockets = await this.server
        .in(this.apiServerSocketId)
        .fetchSockets();
      const existingSocket = sockets[0];
      if (existingSocket) {
        this.logger.warn(
          `Disconnecting existing API server connection from ${this.namespace}: ${this.apiServerSocketId}`,
        );
        existingSocket.disconnect(true);
      }
    }

    this.apiServerSocketId = client.id;
    this.logger.log(
      `API server connected successfully to ${this.namespace} with ID: ${client.id}`,
    );
  }

  protected async handleClientUserConnection(
    client: Socket,
    clientId: string,
    roomId: string,
    token: string,
    tripMemberId?: string,
  ) {
    if (!roomId) {
      throw new Error(`Missing roomId for client user in ${this.namespace}`);
    }

    await client.join(roomId);
    this.connectedClients.set(clientId, {
      type: ClientType.ClientUser,
      roomId,
      token,
      tripMemberId,
    });

    this.logger.log(
      `Client user ${clientId} joined ${this.namespace} room ${roomId}`,
    );

    await this.onClientJoinRoom(client, token, roomId);
  }

  protected handleConnectionError(client: Socket, error: Error) {
    client.emit('error', { message: error.message });
    client.disconnect();
    this.logger.error(
      `Connection failed to ${this.namespace}: ${error.message}`,
    );
  }

  handleDisconnect(client: Socket) {
    const clientId = client.id;
    const clientInfo = this.connectedClients.get(clientId);

    if (!clientInfo) return;

    if (clientInfo.type === ClientType.ApiServer) {
      this.apiServerSocketId = null;
      this.logger.warn(`API server disconnected from ${this.namespace}`);
    }

    this.connectedClients.delete(clientId);
    client.disconnect();
  }

  @SubscribeMessage('emitToRoom')
  handleEmitToRoom(
    client: Socket,
    payload: { roomId: number; event: string; data: any },
  ) {
    try {
      if (client.id !== this.apiServerSocketId) {
        this.logger.warn(
          `Unauthorized emitToRoom attempt from client ${client.id}`,
        );
        return;
      }

      const { roomId, event, data } = payload;
      this.server.to(roomId.toString()).emit(event, data);
      this.logger.log(`Emitted event ${event} to room ${roomId}`);
    } catch (error) {
      this.logger.error(`Error handling emitToRoom: ${error.message}`);
    }
  }

  @SubscribeMessage('emitToMembers')
  handleEmitToMembers(
    client: Socket,
    payload: {
      roomId: number;
      event: string;
      data: Array<{
        tripMemberId: number;
        data: any;
      }>;
    },
  ) {
    try {
      if (client.id !== this.apiServerSocketId) {
        this.logger.warn(
          `Unauthorized emitToMembers attempt from client ${client.id} in ${this.namespace}`,
        );
        return;
      }

      const { roomId, event, data } = payload;
      const sockets = Array.from(this.connectedClients.entries());

      sockets.forEach(([socketId, clientInfo]) => {
        if (
          clientInfo.roomId === roomId.toString() &&
          clientInfo.tripMemberId
        ) {
          const memberData = data.find(
            (item) => item.tripMemberId.toString() === clientInfo.tripMemberId,
          );

          if (memberData) {
            this.server.to(socketId).emit(event, { data: memberData?.data });
            this.logger.log(
              `Emitted personalized ${event} to member ${clientInfo.tripMemberId} in room ${roomId}`,
            );
          }
        }
      });
    } catch (error) {
      this.logger.error(
        `Error handling emitToMembers in ${this.namespace}: ${error.message}`,
      );
    }
  }

  protected async makeApiRequest(
    token: string,
    endpoint: string,
  ): Promise<any> {
    const apiUrl = `${API_URL}/api${endpoint}`;
    try {
      const response = await firstValueFrom(
        this.httpService.get(apiUrl, {
          headers: {
            Authorization: `${token}`,
          },
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error('API request failed:', error.message);
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }
  }
}
