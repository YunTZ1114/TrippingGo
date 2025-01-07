import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { BaseGateway } from 'src/common/gateway/base.gateway';

@Injectable()
@WebSocketGateway({ namespace: '/trips/routes' })
export class RouteGateway extends BaseGateway {
  constructor(httpService: HttpService) {
    super(httpService, 'routes');
  }

  protected async onClientJoinRoom(
    client: Socket,
    token: string,
    roomId: string,
  ): Promise<void> {
    const routes = await this.makeApiRequest(token, `/trips/${roomId}/routes`);
    client.emit('routes', routes);
  }
}
