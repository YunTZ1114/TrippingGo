import { WebSocketGateway } from '@nestjs/websockets';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { BaseGateway } from '../../common/gateway/base.gateway';
import { Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({ namespace: '/trips/places' })
export class PlaceGateway extends BaseGateway {
  constructor(httpService: HttpService) {
    super(httpService, 'places');
  }

  protected async onClientJoinRoom(
    client: Socket,
    token: string,
    roomId: string,
  ): Promise<void> {
    const places = await this.makeApiRequest(token, `/trips/${roomId}/places`);
    client.emit('places', places);
  }
}
