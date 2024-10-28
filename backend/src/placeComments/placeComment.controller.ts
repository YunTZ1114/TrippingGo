import { Body, Controller, Get, Param, ParseIntPipe, Put, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { TripGuard } from 'src/trips/trip.guard';
import { RequiredPermission } from 'src/decorators/required-permission.decorator';
import { PermissionsText } from 'src/types/tripMember.type';
import { PlaceCommentService } from './placeComment.service';
import { UpdatePlaceCommentDto } from './placeComment.dto';

@Controller('trips/:tripId/places/:placeId/placeComments')
@UseGuards(AuthGuard, TripGuard)
export class PlaceCommentController {
  constructor(private readonly placeCommentService: PlaceCommentService) {}

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
  async updatePlaceComment(@Param('placeCommentId', ParseIntPipe) placeCommentId: number, @Body() updatePlaceCommentDto: UpdatePlaceCommentDto) {
    await this.placeCommentService.updatePlaceComment({ placeCommentId, ...updatePlaceCommentDto });

    return { message: 'Update place comment successfully' };
  }
}
