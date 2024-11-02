import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BasePlaceDuration } from 'src/types/placeDuration.type';

@Injectable()
export class PlaceDurationService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getPlaceDurations(tripId: number) {
    if (!tripId) {
      throw new HttpException('Trip ID is required.', HttpStatus.BAD_REQUEST);
    }

    const placeDurations = await this.databaseService.placeDuration.findMany({
      where: {
        place: { tripId },
        isDeleted: false,
      },
      orderBy: {
        id: 'desc',
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return placeDurations.map(({ isDeleted, createdAt, updatedAt, ...other }) => {
      return { ...other };
    });
  }

  async createPlaceDuration({ placeId, date, col, row, groupNumber }: BasePlaceDuration) {
    const place = await this.databaseService.place.findUnique({ where: { id: placeId } });
    if (!place.id) {
      throw new HttpException('Invalid place or trip ID.', HttpStatus.BAD_REQUEST);
    }

    const placeDuration = await this.databaseService.placeDuration.create({
      data: {
        placeId,
        date: new Date(date),
        col,
        row,
        groupNumber,
        isDeleted: false,
      },
    });

    return placeDuration;
  }

  async updatePlaceDuration({ id, date, col, row, groupNumber }: Omit<BasePlaceDuration, 'placeId'> & { id: number }) {
    const placeDuration = await this.databaseService.placeDuration.findUnique({ where: { id, isDeleted: false } });
    if (!placeDuration.id) {
      throw new HttpException('Invalid placeDuration ID.', HttpStatus.BAD_REQUEST);
    }

    await this.databaseService.placeDuration.update({
      where: { id },
      data: {
        date: new Date(date),
        col,
        row,
        groupNumber,
      },
    });

    return placeDuration;
  }

  async deletePlaceDuration(id: number) {
    const placeDuration = await this.databaseService.placeDuration.findUnique({ where: { id, isDeleted: false } });
    if (!placeDuration.id) {
      throw new HttpException('Invalid place duration ID.', HttpStatus.BAD_REQUEST);
    }

    await this.databaseService.placeDuration.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    return placeDuration.id;
  }
}
