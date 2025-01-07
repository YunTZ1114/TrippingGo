import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { AuthModule } from 'src/api/auth/auth.module';
import { AuthGuard } from 'src/api/auth/auth.guard';
import { TokenService } from 'src/utils/token';

const PROVIDERS = [AuthGuard, TokenService, UploadService];

@Module({
  imports: [AuthModule],
  controllers: [UploadController],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class UploadModule {}
