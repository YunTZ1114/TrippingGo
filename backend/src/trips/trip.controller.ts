import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { TripDto, TripQueryDto, UpdateTripDto } from './trip.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { DatabaseService } from 'src/database/database.service';
import { TripGuard } from './trip.guard';
import { RequiredPermission } from 'src/decorators/required-permission.decorator';
import { TripService } from './trip.service';
import { TripMemberService } from '../tripMembers/tripMember.service';
import { PermissionsText } from 'src/types/tripMember.type';

@Controller('trips')
@UseGuards(AuthGuard, TripGuard)
export class TripController {
  constructor(
    private readonly tripService: TripService,
    private readonly tripMemberService: TripMemberService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Get('')
  async getTrips(@Request() req, @Query() tripQueryDto: TripQueryDto) {
    const { userId } = req;
    const { filter, q } = tripQueryDto;
    const trips = await this.tripService.getTrips(filter, q, userId);
    return {
      message: 'Retrieve trip successfully',
      data: trips,
    };
  }

  @Get('/:tripId')
  @RequiredPermission(PermissionsText.VIEWER)
  async getTripDetail(@Param('tripId') tripId: number) {
    const trip = await this.tripService.getTrip(tripId);
    const tripMembers = await this.tripMemberService.getTripMembers(tripId);

    const tripDetail = { trip, tripMembers };

    return {
      message: 'Retrieve trip successfully',
      data: tripDetail,
    };
  }

  @Post('')
  async createTrip(@Request() req, @Body() tripDto: TripDto) {
    const { userId } = req;
    const { name, description, currencyCode, startTime, endTime, memberIds } = tripDto;
    let tripMemberIds = [];

    const result = await this.databaseService.executeTransaction(async () => {
      const tripId = await this.tripService.createTrip({ creatorId: userId, name, description, currencyCode, startTime, endTime });

      if (memberIds?.length) tripMemberIds = await this.tripMemberService.createTripMembers(tripId, memberIds);

      return { tripId, tripMemberIds };
    });

    return {
      message: 'Create trip successfully',
      data: result,
    };
  }

  @Put('/:tripId')
  @RequiredPermission(PermissionsText.CREATOR)
  async updateTrip(@Param('tripId') tripId: number, @Body() updateTripDto: UpdateTripDto) {
    const updatedTripId = await this.tripService.updateTrip({ ...updateTripDto, id: tripId });
    return {
      message: 'Update trip successfully',
      data: updatedTripId,
    };
  }

  @Delete('/:tripId')
  @RequiredPermission(PermissionsText.CREATOR)
  async deleteTrip(@Param('tripId') tripId: number) {
    const result = await this.databaseService.executeTransaction(async () => {
      const removeMemberNumber = await this.tripMemberService.deleteAllTripMembers(tripId);

      const deleteTripId = await this.tripService.deleteTrip(tripId);
      return { removeMemberNumber, deleteTripId };
    });

    return {
      message: `Delete trip (id = ${result.deleteTripId}) and removed ${result.removeMemberNumber} members successfully`,
      data: result.deleteTripId,
    };
  }
}
