import { AuthGuard } from 'src/api/auth/auth.guard';
import { DatabaseService } from 'src/database/database.service';
import { PlaceService } from 'src/api/places/place.service';
import { TripGuard } from '../trips/trip.guard';
import { TokenService } from 'src/utils/token';
import { PlaceDurationService } from './placeDuration.service';
import { DynamicModule, Module } from '@nestjs/common';
import { AuthModule } from 'src/api/auth/auth.module';
import { TripModule } from '../trips/trip.module';
import { PlaceDurationController } from './placeDuration.controller';
import { RouteService } from 'src/api/routes/routes.service';

const PROVIDERS = [AuthGuard, TripGuard, TokenService, DatabaseService, PlaceService, PlaceDurationService, RouteService];

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
