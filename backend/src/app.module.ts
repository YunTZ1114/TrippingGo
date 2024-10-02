import { Module } from '@nestjs/common';
//import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CurrencyModule } from './currencies/currency.module';
import { CountryModule } from './countries/country.module';
import { TripModule } from './trips/trip.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [AuthModule, CurrencyModule, CountryModule, TripModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
