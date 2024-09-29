import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { HttpModule } from '@nestjs/axios';
import { DatabaseService } from 'src/database/database.service';
import { CountryService } from 'src/countries/country.service';

@Module({
  imports: [HttpModule],
  controllers: [CurrencyController],
  providers: [CurrencyService, DatabaseService, CountryService],
})
export class CurrencyModule {}
