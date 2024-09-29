import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CountryService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllCountries() {
    const countries = await this.databaseService.country.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    const filterSet = new Set(['EU']);

    const data = countries
      .filter(({ code }) => {
        return !filterSet.has(code);
      })
      .map(({ id, chName, enName, localName }) => {
        return { id, chName, enName, localName };
      });

    return { data };
  }

  async getCountryById(id: number) {
    const country = await this.databaseService.country.findUnique({
      where: { id },
    });

    if (!country) {
      throw new NotFoundException(`Country with id ${id} not found`);
    }

    return country;
  }
}
