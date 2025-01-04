import { Global, Module } from '@nestjs/common';
import { WebSocketService } from './webSocket.service';

@Global()
@Module({
  providers: [WebSocketService],
  exports: [WebSocketService],
})
export class WebSocketModule {}
