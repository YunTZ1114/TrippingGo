import { Module, DynamicModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseService } from 'src/database/database.service';
import { MailService } from 'src/mails/mail.service';
import { EncryptionService } from 'src/utils/encrypt';
import { TokenService } from 'src/utils/token';

const PROVIDERS = [AuthService, TokenService, MailService, EncryptionService, DatabaseService];

@Module({
  controllers: [AuthController],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: AuthModule,
    };
  }
}
