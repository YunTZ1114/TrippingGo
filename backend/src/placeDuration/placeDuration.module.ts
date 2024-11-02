import { AuthGuard } from 'src/auth/auth.guard';
import { DatabaseService } from 'src/database/database.service';
import { PlaceService } from 'src/places/place.service';
import { TripGuard } from 'src/trips/trip.guard';
import { TokenService } from 'src/utils/token';
import { PlaceDurationService } from './placeDuration.service';
import { DynamicModule, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TripModule } from 'src/trips/trip.module';
import { PlaceDurationController } from './placeDuration.controller';

const PROVIDERS = [AuthGuard, TripGuard, TokenService, DatabaseService, PlaceService, PlaceDurationService];

@Module({
  imports: [AuthModule, TripModule],
  controllers: [PlaceDurationController],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class PlaceDurationModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: PlaceDurationModule,
    };
  }
}
