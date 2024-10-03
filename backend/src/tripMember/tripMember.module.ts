import { Module, DynamicModule } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { TokenService } from 'src/utils/token';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { TripGuard } from 'src/trips/trip.guard';
import { TripMemberService } from '../tripMember/tripMember.service';
import { TripMemberController } from './tripMember.controller';

const PROVIDERS = [AuthGuard, TripGuard, TokenService, DatabaseService, TripMemberService];

@Module({
  imports: [AuthModule],
  controllers: [TripMemberController],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class TripMemberModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: TripMemberModule,
    };
  }
}
