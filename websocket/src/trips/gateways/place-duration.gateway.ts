import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { BaseGateway } from 'src/common/gateway/base.gateway';

@Injectable()
@WebSocketGateway({ namespace: '/trips/place-durations' })
export class PlaceDurationGateway extends BaseGateway {
  constructor(httpService: HttpService) {
    super(httpService, 'placeDurations');
  }

  protected async onClientJoinRoom(
    client: Socket,
    token: string,
    roomId: string,
  ): Promise<void> {
    const placeDurations = await this.makeApiRequest(
      token,
      `/trips/${roomId}/place-durations`,
    );
    client.emit('placeDurations', placeDurations);
  }
}
