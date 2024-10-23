import { DatabaseService } from 'src/database/database.service';
import { PlaceService } from './place.service';
import { TokenService } from 'src/utils/token';
import { TripGuard } from 'src/trips/trip.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { DynamicModule, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TripModule } from 'src/trips/trip.module';
import { PlaceController } from './place.controller';

const PROVIDERS = [AuthGuard, TripGuard, TokenService, DatabaseService, PlaceService];

@Module({
  imports: [AuthModule, TripModule],
  controllers: [PlaceController],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class PlaceModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: PlaceModule,
    };
  }
}
