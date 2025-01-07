import { Module } from '@nestjs/common';
//import { AppController } from './app.controller';
import { AuthModule } from './api/auth/auth.module';
import { CurrencyModule } from './api/currencies/currency.module';
import { CountryModule } from './api/countries/country.module';
import { UserModule } from './api/users/user.module';
import { TripModule } from './api/trips/trip.module';
import { TripMemberModule } from './api/tripMembers/tripMember.module';
import { CheckListModule } from './api/checkLists/checkList.module';
import { ReservationModule } from './api/reservations/reservation.module';
import { PlaceModule } from './api/places/place.module';
import { PlaceCommentModule } from './api/placeComments/placeComment.module';
import { PlaceDurationModule } from './api/placeDuration/placeDuration.module';
import { RouteModule } from './api/routes/routes.module';
import { UploadModule } from './api/upload/upload.module';
import { ExpenseCategoryModule } from './api/expenseCategories/expenseCategory.module';
import { ExpenseModule } from './api/expenses/expense.module';
import { WebSocketModule } from './webSocket/websocket.module';

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
    ExpenseCategoryModule,
    ExpenseModule,
    WebSocketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
