import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequiredPermission } from 'src/decorators/required-permission.decorator';
import { TripMemberService } from './tripMember.service';
import { TripGuard } from 'src/trips/trip.guard';
import { UpdateTripMemberDto } from './tripMember.dto';

@Controller('trips/:tripId/trip-members')
@UseGuards(AuthGuard, TripGuard)
export class TripMemberController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly tripMemberService: TripMemberService,
  ) {}

  @Get('')
  @RequiredPermission(2)
  async getTrip(@Param('tripId') tripId: number) {
    const tripMembers = await this.tripMemberService.getTripMembers(tripId);
    return { data: tripMembers };
  }

  @Post('')
  @RequiredPermission(3)
  async createTripMembers(@Param('tripId') tripId: number, @Body('memberIds') memberIds: number[]) {
    if (memberIds?.length) await this.tripMemberService.createTripMembers(tripId, memberIds);

    return {
      message: 'Add members in trip successfully',
      data: memberIds,
    };
  }

  @Put('')
  @RequiredPermission(2)
  async updateTripMembers(@Request() req, @Param('tripId') tripId: number, @Body() updateTripMembers: UpdateTripMemberDto) {
    const { userId, userPermission } = req;
    const { info, permissions, deletedIds } = updateTripMembers;

    await this.databaseService.executeTransaction(async () => {
      if (userPermission === 4) {
        const memberId = await this.tripMemberService.getTripMember(tripId, userId);

        const deletedIdsFilter = deletedIds?.filter((id) => id !== memberId);
        const permissionsFilter = permissions?.filter(({ id }) => id !== memberId);

        if (deletedIdsFilter) await this.tripMemberService.deleteTripMembers(deletedIdsFilter);
        if (permissionsFilter) await this.tripMemberService.updateTripMemberPermission(permissionsFilter);
      }
      await this.tripMemberService.updateTripMember(info);
    });

    return {
      message: 'Update members in trip successfully',
    };
  }
}
