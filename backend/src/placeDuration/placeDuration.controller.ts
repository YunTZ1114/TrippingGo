import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RequiredPermission } from 'src/decorators/required-permission.decorator';
import { PermissionsText } from 'src/types/tripMember.type';
import { PlaceDurationService } from './placeDuration.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { TripGuard } from 'src/trips/trip.guard';
import { PlaceDurationDto } from './placeDuration.dto';
import { RouteService } from 'src/routes/routes.service';
import { DatabaseService } from 'src/database/database.service';
import { WebSocketService } from 'src/webSocket/webSocket.service';
import { NamespaceType } from 'src/types/webSocket.type';

@Controller('trips/:tripId/place-durations')
@UseGuards(AuthGuard, TripGuard)
export class PlaceDurationController {
  constructor(
    private readonly placeDurationService: PlaceDurationService,
    private readonly routeService: RouteService,
    private readonly databaseService: DatabaseService,
    private readonly webSocketService: WebSocketService,
  ) {}

  private async broadcastPlaceDuration(tripId: number) {
    try {
      const placeDurations = (await this.placeDurationService.getPlaceDurations(tripId)) ?? [];
      await this.webSocketService.emitToRoom(
        tripId,
        'placeDurations',
        {
          data: placeDurations,
        },
        NamespaceType.PlaceDurations,
      );
    } catch (error) {
      console.error(`Failed to broadcast trip members for trip ${tripId}: ${error.message}`);
    }
  }

  @Get('')
  @RequiredPermission(PermissionsText.VIEWER)
  async getPlace(@Param('tripId') tripId: number) {
    const placeDurations = await this.placeDurationService.getPlaceDurations(tripId);

    return { data: placeDurations ?? [] };
  }

  @Post('')
  @RequiredPermission(PermissionsText.EDITOR)
  async createPlaceDuration(@Param('tripId') tripId: number, @Body() placeDurationDto: PlaceDurationDto) {
    const placeDuration = await this.placeDurationService.createPlaceDuration({
      ...placeDurationDto,
    });

    await this.broadcastPlaceDuration(tripId);

    return { data: { placeDuration } };
  }

  @Put('')
  @RequiredPermission(PermissionsText.EDITOR)
  async updatePlaceDurations(
    @Param('tripId') tripId: number,
    @Body() updatePlaceDurationArray: Array<Omit<PlaceDurationDto, 'placeId'> & { id: number }>,
  ) {
    await this.placeDurationService.updatePlaceDurations(updatePlaceDurationArray);

    await this.broadcastPlaceDuration(tripId);

    return { message: 'Place Durations Updated successfully' };
  }

  @Delete('/:placeDurationId')
  @RequiredPermission(PermissionsText.EDITOR)
  async deletePlaceDuration(@Param('tripId') tripId: number, @Param('placeDurationId') placeDurationId: number) {
    await this.databaseService.executeTransaction(async () => {
      await this.placeDurationService.deletePlaceDuration(placeDurationId);
      await this.routeService.deleteRouteByPlaceDuration(placeDurationId);
    });

    await this.broadcastPlaceDuration(tripId);

    return { message: 'Place Duration Deleted successfully' };
  }
}
