import { DatabaseService } from 'src/database/database.service';
import { ReservationService } from './reservation.service';
import { TokenService } from 'src/utils/token';
import { TripGuard } from '../trips/trip.guard';
import { AuthGuard } from 'src/api/auth/auth.guard';
import { DynamicModule, Module } from '@nestjs/common';
import { AuthModule } from 'src/api/auth/auth.module';
import { ReservationController } from './reservation.controller';
import { TripModule } from '../trips/trip.module';

const PROVIDERS = [AuthGuard, TripGuard, TokenService, DatabaseService, ReservationService];

@Module({
  imports: [AuthModule, TripModule],
  controllers: [ReservationController],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class ReservationModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: ReservationModule,
    };
  }
}
