import { DatabaseService } from 'src/database/database.service';
import { TokenService } from 'src/utils/token';
import { TripGuard } from '../trips/trip.guard';
import { AuthGuard } from 'src/api/auth/auth.guard';
import { DynamicModule, Module } from '@nestjs/common';
import { AuthModule } from 'src/api/auth/auth.module';
import { TripModule } from '../trips/trip.module';
import { PlaceCommentService } from './placeComment.service';
import { PlaceCommentController } from './placeComment.controller';
import { PlaceService } from 'src/api/places/place.service';

const PROVIDERS = [AuthGuard, TripGuard, TokenService, DatabaseService, PlaceService, PlaceCommentService];

@Module({
  imports: [AuthModule, TripModule],
  controllers: [PlaceCommentController],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class PlaceCommentModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: PlaceCommentModule,
    };
  }
}
