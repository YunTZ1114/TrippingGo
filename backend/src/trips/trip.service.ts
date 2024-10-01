import { Injectable } from '@nestjs/common';
import { isNumber } from 'class-validator';
import { DatabaseService } from 'src/database/database.service';
import { BaseTrip, TripPreview, TripFilterType } from 'src/types/trip.type';

@Injectable()
export class TripService {
  constructor(private readonly databaseService: DatabaseService) {}

  // ====================    Trip    ====================
  async createTrip({ creatorId, name, description, currencyCode, startTime, endTime }: Omit<BaseTrip, 'id' | 'coverUrl'>) {
    const user = await this.databaseService.user.findUnique({ where: { id: creatorId } });

    const trip = await this.databaseService.trip.create({
      data: { creatorId, name, description, currencyCode, startTime, endTime },
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
        currencyCode: true,
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
          },
        },
      },
    });

    const result = trips.map(({ tripMembers, ...others }) => {
      return {
        ...others,
        memberAmount: tripMembers.length,
      };
    });

    return result;
  }

  // ==================== TripMember ====================
  async createTripMembers(tripId: number, userIds: number[]) {
    const users = await this.databaseService.user.findMany({
      where: {
        id: { in: userIds },
        isVerified: true,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!users?.length) throw new Error('No valid users found for the provided member IDs.');

    const originTripMembers = await this.databaseService.tripMember.findMany({
      where: {
        userId: { in: users.map((user) => user.id) },
        tripId: tripId,
      },
      select: {
        userId: true,
      },
    });

    const tripMemberIdsSet = new Set(originTripMembers.map((member) => member.userId));

    const tripMembersData = users
      .filter(({ id }) => !tripMemberIdsSet.has(id))
      .map((user) => ({
        userId: user.id,
        nickname: user.name,
        tripId: tripId,
      }));

    if (!tripMembersData.length) throw new Error('No new members to add.');

    const tripMembers = await this.databaseService.tripMember.createMany({
      data: tripMembersData,
    });

    if (tripMembers?.count === 0) throw new Error('Error creating trip members');

    return [tripMembers];
  }

  async getTripMembers(tripId: number) {
    const tripMembers = await this.databaseService.tripMember.findMany({
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
      where: { tripId: tripId },
    });

    const formattedTripMembers = tripMembers.map((member) => {
      const { user, tripId, permissions, ...others } = member;

      const role = (() => {
        switch (permissions) {
          case 1:
            return '檢視者';
          case 3:
            return '編輯者';
          case 4:
            return '創建者';
          default:
            return '非法者';
        }
      })();

      return {
        ...others,
        userName: user.name,
        avatar: user.avatar,
        role: role,
      };
    });

    return formattedTripMembers ?? [];
  }

  async getTripMemberPermission(tripId: number, userId: number) {
    const tripMember = await this.databaseService.tripMember.findMany({
      where: { tripId, userId },
      select: { permissions: true },
    });

    if (tripMember.length === 0 || !isNumber(tripMember[0]?.permissions)) {
      throw new Error('Permissions not found or invalid.');
    }

    return tripMember[0]?.permissions;
  }
}
