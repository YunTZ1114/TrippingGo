import { Module, DynamicModule } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { TokenService } from 'src/utils/token';
import { AuthGuard } from 'src/api/auth/auth.guard';
import { AuthModule } from 'src/api/auth/auth.module';
import { TripGuard } from '../trips/trip.guard';
import { TripMemberService } from './tripMember.service';
import { TripMemberController } from './tripMember.controller';
import { PlaceService } from 'src/api/places/place.service';
import { PlaceCommentService } from 'src/api/placeComments/placeComment.service';

const PROVIDERS = [AuthGuard, TripGuard, TokenService, DatabaseService, TripMemberService, PlaceService, PlaceCommentService];

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
