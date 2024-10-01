import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { DatabaseService } from 'src/database/database.service';
import { lastValueFrom } from 'rxjs';
import { CurrencyDto } from './currency.dto';

@Injectable()
export class CurrencyService {
  constructor(
    private readonly httpService: HttpService,
    private readonly databaseService: DatabaseService,
  ) {}

  async getCurrencies() {
    const currencies = await this.databaseService.currency.findMany({
      orderBy: {
        code: 'asc',
      },
    });

    const filterCurrencies = currencies.map(({ id, code, exchangeRate, baseCurrency }) => {
      return { id, code, exchangeRate, baseCurrency };
    });

    return filterCurrencies;
  }

  async createCurrencies() {
    const response = await lastValueFrom(this.httpService.get('https://tw.rter.info/capi.php'));
    const currencyData = response.data;

    const countries = await this.databaseService.country.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    const currencyCodes = countries.reduce((acc, country) => {
      acc.add(country.currencyCode);
      return acc;
    }, new Set<string>());

    const currencyExchange: CurrencyDto[] = Object.entries(currencyData)
      .map(([key, value]) => {
        const code = key.slice(3);
        return { code, exchangeRate: value['Exrate'], baseCurrency: code === 'USD' };
      })
      .filter(({ code }) => currencyCodes.has(code));

    await this.databaseService.currency.createMany({ data: currencyExchange });
  }

  async deleteCurrencies() {
    const currency = await this.databaseService.currency.findMany();

    if (!currency?.length) {
      throw new NotFoundException(`No any currency be found`);
    }

    await this.databaseService.currency.deleteMany();
  }

  async updateCurrencies() {
    const response = await lastValueFrom(this.httpService.get('https://tw.rter.info/capi.php'));
    const currencyData = response.data;

    const currencies = await this.databaseService.currency.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    const currencyCodes = new Set(currencies.map((currency) => currency.code));

    await Promise.all(
      Object.entries(currencyData)
        .filter(([key]) => {
          const code = key.slice(3);
          return currencyCodes.has(code);
        })
        .map(([key, value]) => {
          const code = key.slice(3);
          const newExchangeRate = value['Exrate'];

          return this.databaseService.currency.update({
            where: {
              code: code,
            },
            data: {
              exchangeRate: newExchangeRate,
            },
          });
        }),
    );
  }
}
