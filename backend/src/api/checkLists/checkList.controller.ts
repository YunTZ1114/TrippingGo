import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { RequiredPermission } from 'src/decorators/required-permission.decorator';
import { AuthGuard } from 'src/api/auth/auth.guard';
import { TripGuard } from '../trips/trip.guard';
import { CheckListDto } from './checkList.dto';
import { CheckListService } from './checkList.service';
import { NamespaceType } from 'src/types/webSocket.type';
import { WebSocketService } from 'src/webSocket/webSocket.service';
import { console } from 'inspector';

@Controller('trips/:tripId/check-lists')
@UseGuards(AuthGuard, TripGuard)
export class CheckListController {
  constructor(
    private readonly checkListService: CheckListService,
    private readonly webSocketService: WebSocketService,
  ) {}

  private async broadcastCheckLists(tripId: number) {
    try {
      const data = await this.checkListService.getCheckListsByTrip(tripId);
      await this.webSocketService.emitToMembers(tripId, 'checkLists', data, NamespaceType.Checklists);
    } catch (error) {
      console.error(`Failed to broadcast checkLists for trip ${tripId}: ${error.message}`);
    }
  }

  @Get('')
  @RequiredPermission(1)
  async getCheckList(@Request() req) {
    const { tripMemberId } = req;
    const checkLists = await this.checkListService.getCheckLists(tripMemberId);

    return { data: checkLists, tripMemberId };
  }

  @Post('')
  @RequiredPermission(2)
  async createCheckList(@Request() req, @Param('tripId') tripId: number, @Body() checkListDto: CheckListDto) {
    const { tripMemberId } = req;
    const checkListId = await this.checkListService.createCheckList({ tripMemberId, ...checkListDto });

    await this.broadcastCheckLists(tripId);

    return { data: { checkListId } };
  }

  @Patch('/:checkListId')
  @RequiredPermission(1)
  async updateCheckBox(
    @Request() req,
    @Param('tripId') tripId: number,
    @Param('checkListId') checkListId: number,
    @Body('descriptionKey') descriptionKey: string,
  ) {
    const { tripMemberId } = req;
    const newDescription = await this.checkListService.updateCheckListDescriptionValue(checkListId, descriptionKey, tripMemberId);

    await this.broadcastCheckLists(tripId);

    return newDescription;
  }

  @Put('/:checkListId')
  @RequiredPermission(2)
  async updateCheckList(
    @Request() req,
    @Param('tripId') tripId: number,
    @Param('checkListId') checkListId: number,
    @Body('title') title: string,
    @Body('description') description: string[],
  ) {
    const { tripMemberId } = req;
    const updateData = { id: checkListId, title, description };
    await this.checkListService.updateCheckList(updateData, tripMemberId);

    await this.broadcastCheckLists(tripId);

    return {
      statusCode: 200,
      message: 'Checklist update successfully.',
    };
  }

  @Delete('/:checkListId')
  @RequiredPermission(2)
  async deleteCheckList(@Request() req, @Param('tripId') tripId: number, @Param('checkListId') checkListId: number) {
    const { tripMemberId } = req;
    await this.checkListService.deleteCheckList(checkListId, tripMemberId);

    await this.broadcastCheckLists(tripId);

    return {
      statusCode: 204,
      message: 'Checklist deleted successfully.',
    };
  }
}
