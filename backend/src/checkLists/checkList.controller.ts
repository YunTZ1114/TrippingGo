import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { RequiredPermission } from 'src/decorators/required-permission.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { TripGuard } from 'src/trips/trip.guard';
import { CheckListDto } from './checkList.dto';
import { CheckListService } from './checkList.service';

@Controller('trips/:tripId/check-lists')
@UseGuards(AuthGuard, TripGuard)
export class CheckListController {
  constructor(private readonly checkListService: CheckListService) {}

  @Get('')
  @RequiredPermission(1)
  async getCheckList(@Request() req) {
    const { tripMemberId } = req;
    const checkLists = await this.checkListService.getCheckLists(tripMemberId);

    return { data: checkLists };
  }

  @Post('')
  @RequiredPermission(2)
  async createCheckList(@Request() req, @Body() checkListDto: CheckListDto) {
    const { tripMemberId } = req;
    const checkListId = await this.checkListService.createCheckList({ tripMemberId, ...checkListDto });

    return { data: { checkListId } };
  }

  @Patch('/:checkListId')
  @RequiredPermission(1)
  async updateCheckBox(@Request() req, @Param('checkListId') checkListId: number, @Body('descriptionKey') descriptionKey: string) {
    const { tripMemberId } = req;
    const newDescription = await this.checkListService.updateCheckListDescriptionValue(checkListId, descriptionKey, tripMemberId);
    return newDescription;
  }

  @Put('/:checkListId')
  @RequiredPermission(2)
  async updateCheckList(
    @Request() req,
    @Param('checkListId') checkListId: number,
    @Body('title') title: string,
    @Body('description') description: string[],
  ) {
    const { tripMemberId } = req;
    const updateData = { id: checkListId, title, description };
    await this.checkListService.updateCheckList(updateData, tripMemberId);

    return {
      statusCode: 200,
      message: 'Checklist update successfully.',
    };
  }

  @Delete('/:checkListId')
  @RequiredPermission(2)
  async deleteCheckList(@Request() req, @Param('checkListId') checkListId: number) {
    const { tripMemberId } = req;
    await this.checkListService.deleteCheckList(checkListId, tripMemberId);

    return {
      statusCode: 204,
      message: 'Checklist deleted successfully.',
    };
  }
}
