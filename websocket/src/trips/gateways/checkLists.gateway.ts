import { WebSocketGateway } from '@nestjs/websockets';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { BaseGateway } from '../../common/gateway/base.gateway';
import { Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({ namespace: '/trips/check-lists' })
export class CheckListsGateway extends BaseGateway {
  constructor(httpService: HttpService) {
    super(httpService, 'checkLists');
  }

  protected async onClientJoinRoom(
    client: Socket,
    token: string,
    roomId: string,
  ): Promise<void> {
    const response = await this.makeApiRequest(
      token,
      `/trips/${roomId}/check-lists`,
    );

    client.emit('checkLists', { data: response.data });
  }
}
