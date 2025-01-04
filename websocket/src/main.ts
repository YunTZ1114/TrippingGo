import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3011);
  console.log('WebSocket Server is running in ws://localhost:' + '3011');
}
bootstrap();
