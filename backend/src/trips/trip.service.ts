import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BaseTrip, TripPreview, TripFilterType } from 'src/types/trip.type';
import { PermissionsText } from 'src/types/tripMember.type';

@Injectable()
export class TripService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createTrip({ creatorId, name, description, currencyId, startTime, endTime }: Omit<BaseTrip, 'id' | 'coverUrl'>) {
    const user = await this.databaseService.user.findUnique({ where: { id: creatorId } });
    if (!user) throw new HttpException('User not found.', HttpStatus.NOT_FOUND);

    const trip = await this.databaseService.trip.create({
      data: { creatorId, name, description, currencyId, startTime: new Date(startTime), endTime: new Date(endTime) },
    });

    await this.databaseService.tripMember.create({
      data: {
        userId: user.id,
        nickname: user.name,
        tripId: trip.id,
        permissions: 4,
      },
    });

    return trip.id;
  }

  async getTrip(tripId: number) {
    const tripDetail = await this.databaseService.trip.findUnique({
      where: {
        isDeleted: false,
        id: tripId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        coverUrl: true,
        creatorId: true,
        currencyId: true,
        startTime: true,
        endTime: true,
      },
    });

    if (!tripDetail) throw new HttpException('Trip not found.', HttpStatus.NOT_FOUND);

    return tripDetail;
  }

  async getTrips(filter: TripFilterType, q: string, userId: number): Promise<TripPreview[]> {
    const trips = await this.databaseService.trip.findMany({
      where: {
        isDeleted: false,
        name: {
          contains: q,
          mode: 'insensitive',
        },
        tripMembers: {
          some: {
            userId: userId,
            isDeleted: false,
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        coverUrl: true,
        creatorId: true,
        currencyId: true,
        startTime: true,
        endTime: true,
        updatedAt: true,
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        tripMembers: {
          where: {
            isDeleted: false,
          },
          select: {
            id: true,
            userId: true,
            permissions: true,
          },
        },
      },
    });

    const result = trips.map(({ tripMembers, ...others }) => {
      const userMember = tripMembers.find((member) => member.userId === userId);

      return {
        ...others,
        memberAmount: tripMembers.length,
        permissions: userMember ? PermissionsText[userMember.permissions] : null,
      };
    });

    return result;
  }

  async updateTrip({ id, name, description, currencyId, startTime, endTime, coverUrl }: Omit<BaseTrip, 'creatorId'>) {
    const trip = await this.databaseService.trip.findUnique({ where: { id } });

    if (!trip) throw new HttpException('The trip does not exist.', HttpStatus.NOT_FOUND);

    const updatedTrip = await this.databaseService.trip.update({
      where: { id, isDeleted: false },
      data: {
        name,
        description,
        currencyId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        coverUrl: coverUrl ?? trip.coverUrl,
      },
    });

    return updatedTrip.id;
  }

  async setTripIsPublic({ id, isPublic }: { id: number; isPublic: boolean }) {
    const trip = await this.databaseService.trip.findUnique({ where: { id } });

    if (!trip) throw new HttpException('The trip does not exist.', HttpStatus.NOT_FOUND);

    const updatedTrip = await this.databaseService.trip.update({
      where: { id, isDeleted: false },
      data: {
        isPublic: isPublic,
      },
    });

    return updatedTrip.id;
  }

  async deleteTrip(id: number) {
    const trip = await this.databaseService.trip.findUnique({ where: { id } });

    if (!trip) throw new HttpException('The trip does not exist.', HttpStatus.NOT_FOUND);

    const deleteTrip = await this.databaseService.trip.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    return deleteTrip.id;
  }
}
