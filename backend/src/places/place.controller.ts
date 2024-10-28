import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { TripGuard } from 'src/trips/trip.guard';
import { PlaceService } from './place.service';
import { RequiredPermission } from 'src/decorators/required-permission.decorator';
import { BasePlace } from 'src/types/place.type';
import { PlaceAttributesDto } from './place.dto';
import { PermissionsText } from 'src/types/tripMember.type';
import { PlaceCommentService } from 'src/placeComments/placeComment.service';
import { DatabaseService } from 'src/database/database.service';

@Controller('trips/:tripId/places')
@UseGuards(AuthGuard, TripGuard)
export class PlaceController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly placeService: PlaceService,
    private readonly placeCommentService: PlaceCommentService,
  ) {}

  @Get('')
  @RequiredPermission(PermissionsText.VIEWER)
  async getPlace(@Request() req) {
    const { tripId } = req;
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

    return { data: { placeId } };
  }

  @Put('/:placeId')
  @RequiredPermission(PermissionsText.EDITOR)
  async updatePlace(@Param('placeId') placeId: number, @Body() placeAttributesDto: PlaceAttributesDto) {
    await this.placeService.updatePlace({ placeId, ...placeAttributesDto });

    return { message: 'Update place in trip successfully' };
  }

  @Delete('/:placeId')
  @RequiredPermission(PermissionsText.EDITOR)
  async deletePlace(@Param('placeId') placeId: number) {
    await this.databaseService.executeTransaction(async () => {
      await this.placeService.deletePlace(placeId);
      await this.placeCommentService.deletePlaceComment(placeId);
    });

    return { message: 'Delete reservation in trip successfully' };
  }
}
