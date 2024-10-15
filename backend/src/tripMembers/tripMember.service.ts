import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { isNumber } from 'class-validator';
import { DatabaseService } from 'src/database/database.service';
import { BaseTripMember, PermissionsText } from 'src/types/tripMember.type';

@Injectable()
export class TripMemberService {
  constructor(private readonly databaseService: DatabaseService) {}

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

    if (!users?.length) throw new HttpException('Invalid trip ID or user IDs.', HttpStatus.BAD_REQUEST);

    const originTripMembers = await this.databaseService.tripMember.findMany({
      where: {
        userId: { in: users.map((user) => user.id) },
        tripId: tripId,
        isDeleted: false,
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

    if (!tripMembersData.length) throw new HttpException('No new members to add.', HttpStatus.NOT_MODIFIED);

    const tripMembers = await this.databaseService.tripMember.createMany({
      data: tripMembersData,
    });

    if (tripMembers?.count === 0) throw new HttpException('Error creating trip members', HttpStatus.INTERNAL_SERVER_ERROR);

    return [tripMembers];
  }

  async getTripMember(tripId: number, userId: number) {
    const tripMember = await this.databaseService.tripMember.findFirst({
      where: { tripId, userId },
    });

    return tripMember?.id;
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
      where: { tripId: tripId, isDeleted: false },
      orderBy: { id: 'asc' },
    });

    const formattedTripMembers = tripMembers.map((member) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { user, tripId, permissions, ...others } = member;

      const role = (() => {
        switch (permissions) {
          case PermissionsText.DELETED:
            return 'DELETED';
          case PermissionsText.VIEWER:
            return 'VIEWER';
          case PermissionsText.EDITOR:
            return 'EDITOR';
          case PermissionsText.CREATOR:
            return 'CREATOR';
          default:
            return 'NONE';
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
      select: { permissions: true, id: true },
    });

    if (tripMember.length === 0 || !isNumber(tripMember[0]?.permissions))
      throw new HttpException('Permissions not found or invalid.', HttpStatus.NOT_FOUND);

    return tripMember[0];
  }

  async updateTripMember(memberData: Omit<BaseTripMember, 'permissions'>[]) {
    await Promise.all(
      memberData.map(({ id, nickname, description = {}, note = '' }) =>
        this.databaseService.tripMember.update({
          where: { id },
          data: { nickname, description, note },
        }),
      ),
    );
  }

  async updateTripMemberPermission(permissionUpdates: { id: number; permissions: PermissionsText }[]) {
    await Promise.all(
      permissionUpdates.map(({ id, permissions }) =>
        this.databaseService.tripMember.update({
          where: { id },
          data: { permissions: Number(PermissionsText[permissions]) },
        }),
      ),
    );
  }

  async deleteTripMembers(ids: number[]) {
    const updatedMembers = await this.databaseService.tripMember.updateMany({
      where: { id: { in: ids } },
      data: { isDeleted: true, permissions: PermissionsText.DELETED },
    });

    return updatedMembers.count;
  }

  async deleteAllTripMembers(tripId: number) {
    const updatedMembers = await this.databaseService.tripMember.updateMany({
      where: { tripId },
      data: { isDeleted: true, permissions: PermissionsText.DELETED },
    });

    return updatedMembers.count;
  }
}
