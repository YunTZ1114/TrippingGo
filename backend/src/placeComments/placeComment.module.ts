import { DatabaseService } from 'src/database/database.service';
import { TokenService } from 'src/utils/token';
import { TripGuard } from 'src/trips/trip.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { DynamicModule, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TripModule } from 'src/trips/trip.module';
import { PlaceCommentService } from './placeComment.service';
import { PlaceCommentController } from './placeComment.controller';

const PROVIDERS = [AuthGuard, TripGuard, TokenService, DatabaseService, PlaceCommentService];

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
