import { Injectable } from '@nestjs/common';
import { Configuration, CurrencyApi } from 'cloudmersive-currency-api-client';
import { CLOUDMERSIVE_API_KEY } from '../config';

@Injectable()
export class CurrencyService {
  private currencyApi: CurrencyApi;

  constructor() {
    const apiKey = CLOUDMERSIVE_API_KEY;
    const configuration = new Configuration({
      apiKey: apiKey,
    });
    this.currencyApi = new CurrencyApi(configuration);
  }

  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    try {
      const response = await this.currencyApi.CurrencyConvertPost({
        fromCurrency,
        toCurrency,
        amount: 1,
      });
      return response.convertedAmount;
    } catch (error) {
      throw new Error(`Failed to get exchange rate: ${error.message}`);
    }
  }
}
