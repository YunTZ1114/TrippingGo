import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequiredPermission } from 'src/decorators/required-permission.decorator';
import { TripMemberService } from './tripMember.service';
import { TripGuard } from 'src/trips/trip.guard';
import { UpdateTripMemberDto } from './tripMember.dto';
import { PermissionsText } from 'src/types/tripMember.type';

@Controller('trips/:tripId/trip-members')
@UseGuards(AuthGuard, TripGuard)
export class TripMemberController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly tripMemberService: TripMemberService,
  ) {}

  @Get('')
  @RequiredPermission(PermissionsText.EDITOR)
  async getTrip(@Param('tripId') tripId: number) {
    const tripMembers = await this.tripMemberService.getTripMembers(tripId);
    return { data: tripMembers };
  }

  @Post('')
  @RequiredPermission(PermissionsText.CREATOR)
  async createTripMembers(@Param('tripId') tripId: number, @Body('memberIds') memberIds: number[]) {
    if (memberIds?.length) await this.tripMemberService.createTripMembers(tripId, memberIds);

    return {
      message: 'Add members in trip successfully',
      data: memberIds,
    };
  }

  @Put('')
  @RequiredPermission(PermissionsText.EDITOR)
  async updateTripMembers(@Request() req, @Param('tripId') tripId: number, @Body() updateTripMembers: UpdateTripMemberDto) {
    const { userId, userPermission } = req;
    const { info, permissions } = updateTripMembers;

    await this.databaseService.executeTransaction(async () => {
      if (userPermission === PermissionsText.CREATOR) {
        const memberId = await this.tripMemberService.getTripMember(tripId, userId);

        const permissionsFilter = permissions?.filter(({ id }) => id !== memberId);

        if (permissionsFilter) await this.tripMemberService.updateTripMemberPermission(permissionsFilter);
      }
      await this.tripMemberService.updateTripMember(info);
    });

    return {
      message: 'Update members in trip successfully',
    };
  }

  @Delete('/:tripMemberId')
  @RequiredPermission(PermissionsText.EDITOR)
  async deleteTripMembers(@Request() req, @Param('tripMemberId') tripMemberId: number) {
    const { userId, userPermission } = req;

    if (userPermission === PermissionsText.CREATOR && userId !== tripMemberId) {
      await this.tripMemberService.deleteTripMembers([tripMemberId]);
    }

    if (userPermission !== PermissionsText.CREATOR && userId === tripMemberId) await this.tripMemberService.deleteTripMembers([tripMemberId]);

    return {
      message: 'Delete members in trip successfully',
    };
  }
}
