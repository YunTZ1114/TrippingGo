import { Module } from '@nestjs/common';
//import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CurrencyModule } from './currencies/currency.module';
import { CountryModule } from './countries/country.module';
import { UserModule } from './users/user.module';
import { TripModule } from './trips/trip.module';
import { TripMemberModule } from './tripMember/tripMember.module';

@Module({
  imports: [AuthModule, CurrencyModule, CountryModule, TripModule, TripMemberModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
