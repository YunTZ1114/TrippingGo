import { Injectable } from '@nestjs/common';
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

    if (tripMember.length === 0 || !isNumber(tripMember[0]?.permissions)) {
      throw new Error('Permissions not found or invalid.');
    }

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
          data: { permissions },
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
      data: { isDeleted: true, permissions: 0 },
    });

    return updatedMembers.count;
  }
}
