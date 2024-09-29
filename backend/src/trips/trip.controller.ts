import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripDto, TripQueryDto } from './trip.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { DatabaseService } from 'src/database/database.service';
import { TripGuard } from './trip.guard';
import { RequiredPermission } from 'src/decorators/required-permission.decorator';

@Controller('trips')
@UseGuards(AuthGuard, TripGuard)
export class TripController {
  constructor(
    private readonly tripService: TripService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Get('')
  async getTrips(@Request() req, @Query() tripQueryDto: TripQueryDto) {
    const { filter, q } = tripQueryDto;
    const aaa = await this.tripService.getTrips(filter, q);
    return {
      message: 'Create trip successfully',
      data: aaa,
    };
  }

  @Post('')
  async createTrip(@Request() req, @Body() tripDto: TripDto) {
    const { userId } = req;
    const { name, description, currencyCode, startTime, endTime, memberIds } = tripDto;
    let tripMemberIds = [];

    const result = await this.databaseService.executeTransaction(async () => {
      const tripId = await this.tripService.createTrip({ creatorId: userId, name, description, currencyCode, startTime, endTime });

      if (memberIds?.length) tripMemberIds = await this.tripService.createTripMembers(tripId, memberIds);

      return { data: { tripId, tripMemberIds } };
    });

    return {
      message: 'Create trip successfully',
      data: result,
    };
  }

  @Get('/:tripId/members')
  @RequiredPermission(2)
  async getTrip(@Param('tripId') tripId: number) {
    const tripMembers = await this.tripService.getTripMembers(tripId);
    return { data: tripMembers };
  }

  @Post('/:tripId/members')
  @RequiredPermission(4)
  async createTripMembers(@Param('tripId') tripId: number, @Body('memberIds') memberIds: number[]) {
    if (memberIds?.length) await this.tripService.createTripMembers(tripId, memberIds);

    return {
      message: 'Add members in trip successfully',
      data: memberIds,
    };
  }
}
