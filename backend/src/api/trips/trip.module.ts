import { Module, DynamicModule } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { TokenService } from 'src/utils/token';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { AuthGuard } from 'src/api/auth/auth.guard';
import { AuthModule } from 'src/api/auth/auth.module';
import { TripGuard } from './trip.guard';
import { TripMemberService } from '../tripMembers/tripMember.service';

const PROVIDERS = [AuthGuard, TripGuard, TokenService, DatabaseService, TripService, TripMemberService];

@Module({
  imports: [AuthModule],
  controllers: [TripController],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class TripModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: TripModule,
    };
  }
}
