import { WebSocketGateway } from '@nestjs/websockets';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { BaseGateway } from '../../common/gateway/base.gateway';
import { Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({ namespace: '/trips/trip-members' })
export class TripMemberGateway extends BaseGateway {
  constructor(httpService: HttpService) {
    super(httpService, 'TripMember');
  }

  protected async onClientJoinRoom(
    client: Socket,
    token: string,
    roomId: string,
  ): Promise<void> {
    const tripMembers = await this.makeApiRequest(
      token,
      `/trips/${roomId}/trip-members`,
    );
    client.emit('tripMembers', tripMembers);
  }
}
