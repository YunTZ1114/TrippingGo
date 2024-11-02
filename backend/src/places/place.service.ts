import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BasePlace, PlaceAttributes } from 'src/types/place.type';

@Injectable()
export class PlaceService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getPlaces(tripId: number) {
    if (!tripId) {
      throw new HttpException('Trip ID is required.', HttpStatus.BAD_REQUEST);
    }

    const places = await this.databaseService.place.findMany({
      where: {
        tripId,
        isDeleted: false,
      },
      orderBy: {
        id: 'desc',
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return places.map(({ isDeleted, createdAt, ...other }) => {
      return { ...other };
    });
  }

  async createPlace({ tripId, locationLat, locationLng, name, weekdayText, googleMapUrl, googlePlaceId, address }: BasePlace) {
    const place = await this.databaseService.place.create({
      data: {
        tripId,
        locationLat,
        locationLng,
        name,
        weekdayText,
        googleMapUrl,
        googlePlaceId,
        address,
      },
    });

    return place.id;
  }

  async updatePlace({ placeId, duration, cost, rating, icon }: PlaceAttributes & { placeId: number }) {
    const place = await this.databaseService.place.findUnique({
      where: {
        id: placeId,
        isDeleted: false,
      },
    });

    if (!place) throw new HttpException('The place is not found.', HttpStatus.NOT_FOUND);

    await this.databaseService.place.update({
      where: { id: placeId },
      data: {
        duration,
        cost,
        rating,
        icon,
      },
    });

    return place.id;
  }

  async deletePlace(placeId: number) {
    const place = await this.databaseService.place.findUnique({
      where: {
        id: placeId,
        isDeleted: false,
      },
    });

    if (!place) throw new HttpException('The place is not found.', HttpStatus.NOT_FOUND);

    await this.databaseService.place.update({
      where: { id: placeId },
      data: { isDeleted: true },
    });

    return place.id;
  }
}
