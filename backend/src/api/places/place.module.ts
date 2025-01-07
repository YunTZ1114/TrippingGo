import { DatabaseService } from '../../database/database.service';
import { PlaceService } from './place.service';
import { TokenService } from '../../utils/token';
import { TripGuard } from '../trips/trip.guard';
import { AuthGuard } from '../auth/auth.guard';
import { DynamicModule, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TripModule } from '../trips/trip.module';
import { PlaceController } from './place.controller';
import { PlaceCommentService } from '../placeComments/placeComment.service';

const PROVIDERS = [AuthGuard, TripGuard, TokenService, DatabaseService, PlaceService, PlaceCommentService];

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
