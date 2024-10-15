import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BaseCheckList } from 'src/types/checkList.type';

@Injectable()
export class CheckListService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getCheckLists(tripMemberId: number) {
    const tripMember = await this.databaseService.tripMember.findUnique({
      where: { id: tripMemberId, isDeleted: false },
    });

    if (!tripMember) throw new HttpException('The trip member is not found.', HttpStatus.NOT_FOUND);

    const checkLists = await this.databaseService.checkList.findMany({
      where: {
        OR: [
          { tripMemberId, isPublic: false, isDeleted: false },
          {
            tripMember: {
              tripId: tripMember.tripId,
            },
            isPublic: true,
            isDeleted: false,
          },
        ],
      },
      orderBy: {
        id: 'desc',
      },
    });

    const formattedCheckLists = checkLists.map(({ description, ...others }) => {
      const formattedDescription = Object.entries(description).map(([key, value]) => {
        return { text: key, checked: value.includes(tripMemberId) };
      });
      return { ...others, description: formattedDescription };
    });

    return formattedCheckLists;
  }

  async createCheckList({ tripMemberId, title, type, description, isPublic }: Omit<BaseCheckList, 'id'>) {
    const tripMember = await this.databaseService.tripMember.findUnique({
      where: { id: tripMemberId },
    });

    if (!tripMember) throw new HttpException('The trip member is not found.', HttpStatus.NOT_FOUND);

    const descriptionObject = description.reduce(
      (acc, key) => {
        acc[key] = [];
        return acc;
      },
      {} as Record<string, any[]>,
    );

    const checkList = await this.databaseService.checkList.create({
      data: { tripMemberId, title, type, description: descriptionObject, isPublic },
    });

    return checkList?.id;
  }

  async updateCheckListDescriptionValue(checkListId: number, descriptionKey: string, tripMemberId: number) {
    const checkList = await this.databaseService.checkList.findUnique({ where: { id: checkListId, isDeleted: false } });
    if (!checkList) throw new HttpException('The checkList is not found.', HttpStatus.NOT_FOUND);

    const { isPublic, tripMemberId: creatorId } = checkList;
    if (!isPublic && tripMemberId !== creatorId)
      throw new HttpException('You do not have permission to delete this checklist.', HttpStatus.FORBIDDEN);

    const { description } = checkList;
    if (!description || typeof description !== 'object')
      throw new HttpException('The description field is not a valid object.', HttpStatus.BAD_REQUEST);

    if (!(descriptionKey in description))
      throw new HttpException(`The description key "${descriptionKey}" is not found in the checklist.`, HttpStatus.BAD_REQUEST);

    const memberIdIndex = description[descriptionKey].indexOf(tripMemberId);
    if (memberIdIndex > -1) description[descriptionKey].splice(memberIdIndex, 1);
    else description[descriptionKey].push(tripMemberId);

    await this.databaseService.checkList.update({
      where: { id: checkListId },
      data: { description },
    });

    const updatedCheckList = await this.databaseService.checkList.findUnique({
      where: { id: checkListId },
    });

    return updatedCheckList;
  }

  async updateCheckList({ id, title, description }: { id: number; title: string; description: string[] }, tripMemberId: number) {
    const checkList = await this.databaseService.checkList.findUnique({ where: { id, isDeleted: false } });
    if (!checkList) throw new HttpException('The checkList is not found.', HttpStatus.NOT_FOUND);

    const { isPublic, tripMemberId: creatorId } = checkList;
    if (!isPublic && tripMemberId !== creatorId) throw new ForbiddenException('You do not have permission to update this checklist.');

    const descriptionObject = description.reduce(
      (acc, key) => {
        acc[key] = [];
        return acc;
      },
      {} as Record<string, any[]>,
    );

    await this.databaseService.checkList.update({ where: { id }, data: { title, description: descriptionObject } });
  }

  async deleteCheckList(checkListId: number, tripMemberId: number) {
    const checkList = await this.databaseService.checkList.findUnique({
      where: { id: checkListId },
    });

    if (!checkList) throw new HttpException('The checkList is not found.', HttpStatus.NOT_FOUND);

    const { isPublic, tripMemberId: creatorId } = checkList;

    if (!isPublic && tripMemberId !== creatorId)
      throw new HttpException('You do not have permission to delete this checklist.', HttpStatus.FORBIDDEN);

    await this.databaseService.checkList.update({ where: { id: checkListId }, data: { isDeleted: true } });
  }
}
