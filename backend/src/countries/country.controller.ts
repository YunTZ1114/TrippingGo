// src/countries/country.controller.ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CountryService } from './country.service';

@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async getAllCountries() {
    return this.countryService.getAllCountries();
  }

  @Get(':id')
  async getCountry(@Param('id', ParseIntPipe) id: number) {
    return this.countryService.getCountryById(id);
  }
}
