import { Module } from '@nestjs/common';
//import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CurrencyModule } from './currencies/currency.module';
import { CountryModule } from './countries/country.module';
import { UserModule } from './users/user.module';
import { TripModule } from './trips/trip.module';
import { TripMemberModule } from './tripMembers/tripMember.module';
import { CheckListModule } from './checkLists/checkList.module';
import { ReservationModule } from './reservations/reservation.module';
import { PlaceModule } from './places/place.module';
import { PlaceCommentModule } from './placeComments/placeComment.module';
import { PlaceDurationModule } from './placeDuration/placeDuration.module';
import { RouteModule } from './routes/routes.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    AuthModule,
    CurrencyModule,
    CountryModule,
    TripModule,
    TripMemberModule,
    UserModule,
    CheckListModule,
    PlaceModule,
    ReservationModule,
    PlaceCommentModule,
    PlaceDurationModule,
    RouteModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
