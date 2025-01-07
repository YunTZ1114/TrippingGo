import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('currencies')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('')
  async getCurrencies() {
    const result = await this.currencyService.getCurrencies();
    return { message: 'Get currencies successfully', data: result };
  }

  @Post('')
  async createCurrencies() {
    const result = await this.currencyService.createCurrencies();
    return { message: 'Currencies fetched and stored successfully', data: result };
  }

  @Delete('')
  async deleteCurrencies() {
    const result = await this.currencyService.deleteCurrencies();
    return { message: 'Currencies delete successfully', data: result };
  }

  @Put('')
  async updateCurrencies() {
    const result = await this.currencyService.updateCurrencies();
    return { message: 'Currencies update successfully', data: result };
  }
}
