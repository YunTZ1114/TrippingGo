import { AuthGuard } from 'src/auth/auth.guard';
import { DatabaseService } from 'src/database/database.service';
import { PlaceService } from 'src/places/place.service';
import { TripGuard } from 'src/trips/trip.guard';
import { TokenService } from 'src/utils/token';
import { DynamicModule, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TripModule } from 'src/trips/trip.module';
import { RouteService } from './routes.service';
import { RouteController } from './routes.controller';

const PROVIDERS = [AuthGuard, TripGuard, TokenService, DatabaseService, PlaceService, RouteService];

@Module({
  imports: [AuthModule, TripModule],
  controllers: [RouteController],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class RouteModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: RouteModule,
    };
  }
}
