import { Module, DynamicModule } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { TokenService } from 'src/utils/token';
import { AuthGuard } from 'src/api/auth/auth.guard';
import { AuthModule } from 'src/api/auth/auth.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const PROVIDERS = [AuthGuard, TokenService, DatabaseService, UserService];

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class UserModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: UserModule,
    };
  }
}
