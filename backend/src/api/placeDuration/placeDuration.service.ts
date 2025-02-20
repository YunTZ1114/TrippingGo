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
      select: {
        id: true,
        date: true,
        col: true,
        row: true,
        groupNumber: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        place: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return placeDurations.map(({ isDeleted, createdAt, updatedAt, date, ...other }) => {
      const formattedDate = new Date(date).toISOString().split('T')[0];

      return { ...other, date: formattedDate };
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
    if (!placeDuration?.id) {
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

  async updatePlaceDurations(placeDurations: Array<Omit<BasePlaceDuration, 'placeId'> & { id: number }>) {
    const ids = placeDurations.map((item) => item.id);
    const existingPlaceDurations = await this.databaseService.placeDuration.findMany({
      where: {
        id: { in: ids },
        isDeleted: false,
      },
    });

    if (existingPlaceDurations.length !== ids.length) {
      throw new HttpException('One or more invalid placeDuration IDs.', HttpStatus.BAD_REQUEST);
    }

    const updates = await this.databaseService.$transaction(
      placeDurations.map(({ id, date, col, row, groupNumber }) =>
        this.databaseService.placeDuration.update({
          where: { id },
          data: {
            date: new Date(date),
            col,
            row,
            groupNumber,
          },
        }),
      ),
    );

    return updates;
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
