import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { TripGuard } from 'src/trips/trip.guard';
import { PlaceService } from './place.service';
import { RequiredPermission } from 'src/decorators/required-permission.decorator';
import { BasePlace } from 'src/types/place.type';
import { PlaceAttributesDto } from './place.dto';
import { PermissionsText } from 'src/types/tripMember.type';
import { PlaceCommentService } from 'src/placeComments/placeComment.service';
import { DatabaseService } from 'src/database/database.service';
import { NamespaceType } from 'src/types/webSocket.type';
import { WebSocketService } from 'src/webSocket/webSocket.service';

@Controller('trips/:tripId/places')
@UseGuards(AuthGuard, TripGuard)
export class PlaceController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly placeService: PlaceService,
    private readonly placeCommentService: PlaceCommentService,
    private readonly webSocketService: WebSocketService,
  ) {}

  private async broadcastPlaces(tripId: number) {
    try {
      const places = await this.placeService.getPlaces(tripId);
      await this.webSocketService.emitToRoom(
        tripId,
        'places',
        {
          data: places,
        },
        NamespaceType.Places,
      );
    } catch (error) {
      console.error(`Failed to broadcast places for trip ${tripId}: ${error.message}`);
    }
  }

  @Get('')
  @RequiredPermission(PermissionsText.VIEWER)
  async getPlace(@Param('tripId') tripId: number) {
    const places = await this.placeService.getPlaces(tripId);

    return { data: places };
  }

  @Post('')
  @RequiredPermission(PermissionsText.EDITOR)
  async createPlace(@Param('tripId') tripId: number, @Body() basePlace: BasePlace) {
    const placeId = await this.databaseService.executeTransaction(async () => {
      const placeId = await this.placeService.createPlace({ tripId, ...basePlace });
      await this.placeCommentService.createPlaceComment({ placeId });
      return placeId;
    });

    await this.broadcastPlaces(tripId);

    return { data: { placeId } };
  }

  @Put('/:placeId')
  @RequiredPermission(PermissionsText.EDITOR)
  async updatePlace(@Param('tripId') tripId: number, @Param('placeId') placeId: number, @Body() placeAttributesDto: PlaceAttributesDto) {
    await this.placeService.updatePlace({ placeId, ...placeAttributesDto });

    await this.broadcastPlaces(tripId);

    return { message: 'Update place in trip successfully' };
  }

  @Delete('/:placeId')
  @RequiredPermission(PermissionsText.EDITOR)
  async deletePlace(@Param('tripId') tripId: number, @Param('placeId') placeId: number) {
    await this.databaseService.executeTransaction(async () => {
      await this.placeService.deletePlace(placeId);
      await this.placeCommentService.deletePlaceComment(placeId);
    });

    await this.broadcastPlaces(tripId);

    return { message: 'Delete reservation in trip successfully' };
  }
}
