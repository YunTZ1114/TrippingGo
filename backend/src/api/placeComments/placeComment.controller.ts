import { Body, Controller, Get, Param, Put, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from 'src/api/auth/auth.guard';
import { TripGuard } from '../trips/trip.guard';
import { RequiredPermission } from 'src/decorators/required-permission.decorator';
import { PermissionsText } from 'src/types/tripMember.type';
import { PlaceCommentService } from './placeComment.service';
import { UpdatePlaceCommentDto } from './placeComment.dto';
import { PlaceService } from 'src/api/places/place.service';

@Controller('trips/:tripId/places/:placeId/placeComments')
@UseGuards(AuthGuard, TripGuard)
export class PlaceCommentController {
  constructor(
    private readonly placeCommentService: PlaceCommentService,
    private readonly placeService: PlaceService,
  ) {}

  @Get('')
  @RequiredPermission(PermissionsText.VIEWER)
  async getPlaceComments(@Request() req, @Param('placeId') placeId: number) {
    const { tripMemberId } = req;

    const placeComments = await this.placeCommentService.getPlaceComments(placeId);
    const result = placeComments.map((item) => {
      return { ...item, isOwner: tripMemberId === item.tripMemberId };
    });

    return { data: result };
  }

  @Put('/:placeCommentId')
  @RequiredPermission(PermissionsText.VIEWER)
  async updatePlaceComment(
    @Param('placeId', ParseIntPipe) placeId: number,
    @Param('placeCommentId', ParseIntPipe) placeCommentId: number,
    @Body() updatePlaceCommentDto: UpdatePlaceCommentDto,
  ) {
    await this.placeCommentService.updatePlaceComment({ placeCommentId, ...updatePlaceCommentDto });
    await this.placeService.updateRating(placeId);

    return { message: 'Update place comment successfully' };
  }
}
