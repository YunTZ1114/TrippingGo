import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequiredPermission } from 'src/decorators/required-permission.decorator';
import { TripMemberService } from './tripMember.service';
import { TripGuard } from 'src/trips/trip.guard';
import { UpdateTripMemberDto } from './tripMember.dto';
import { PermissionsText } from 'src/types/tripMember.type';
import { PlaceCommentService } from 'src/placeComments/placeComment.service';

@Controller('trips/:tripId/trip-members')
@UseGuards(AuthGuard, TripGuard)
export class TripMemberController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly tripMemberService: TripMemberService,
    private readonly placeCommentService: PlaceCommentService,
  ) {}

  @Get('')
  @RequiredPermission(PermissionsText.VIEWER)
  async getTrip(@Param('tripId') tripId: number) {
    const tripMembers = await this.tripMemberService.getTripMembers(tripId);
    return { data: tripMembers };
  }

  @Post('')
  @RequiredPermission(PermissionsText.CREATOR)
  async createTripMembers(@Param('tripId') tripId: number, @Body('memberIds') memberIds: number[]) {
    if (!memberIds?.length) return { message: 'Member IDs array is required and cannot be empty' };
    await this.databaseService.executeTransaction(async () => {
      await this.tripMemberService.createTripMembers(tripId, memberIds);
      await this.placeCommentService.createPlaceCommentByTripMember(memberIds);
    });

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

    if (!info && !permissions) throw new HttpException('No update data provided.', HttpStatus.BAD_REQUEST);

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

  @Patch('accept-invitation')
  @RequiredPermission(PermissionsText.PENDING)
  async acceptInvitation(@Request() req, @Param('tripId') tripId: number) {
    const { userId } = req;

    await this.tripMemberService.acceptInvitation(userId, tripId);

    return {
      message: 'Update members in trip successfully',
    };
  }

  @Delete('/:tripMemberId')
  @RequiredPermission(PermissionsText.VIEWER)
  async deleteTripMembers(@Request() req, @Param('tripMemberId') tripMemberId: number) {
    const { userId, userPermission } = req;

    const canDelete =
      (userPermission === PermissionsText.CREATOR && userId !== tripMemberId) ||
      (userPermission !== PermissionsText.CREATOR && userId === tripMemberId);

    if (!canDelete) {
      throw new HttpException('You do not have permission to delete this member', HttpStatus.FORBIDDEN);
    }

    await this.databaseService.executeTransaction(async () => {
      await this.tripMemberService.deleteTripMembers([tripMemberId]);
      await this.placeCommentService.deletePlaceCommentByTripMember(tripMemberId);
    });

    return {
      message: 'Delete members in trip successfully',
    };
  }
}
