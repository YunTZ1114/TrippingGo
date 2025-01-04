import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import { Logger, ValidationPipe } from '@nestjs/common';

import { HttpExceptionFilter } from './utils/http-exception';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WebSocketService } from './webSocket/webSocket.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const webSocketService = app.get(WebSocketService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api');

  app.use((req, res, next) => {
    Logger.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`, 'HTTP');
    next();
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT || 3000);
  console.log('Server is running in http://localhost:' + process.env.PORT);
}

bootstrap().catch((error) => {
  Logger.error('Bootstrap error:', error);
  process.exit(1);
});
