import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PlaceCommentService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getPlaceComments(placeId: number) {
    const placeComments = await this.databaseService.placeComment.findMany({
      where: {
        placeId,
        isDeleted: false,
      },
      orderBy: {
        id: 'desc',
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return placeComments.map(({ isDeleted, createdAt, ...other }) => {
      return { ...other };
    });
  }

  async createPlaceComment({ placeId }: { placeId: number }) {
    const tripMembers = await this.databaseService.tripMember.findMany({
      where: {
        trip: {
          places: {
            some: {
              id: placeId,
            },
          },
        },
        isDeleted: false,
      },
    });

    const placeComments = await this.databaseService.placeComment.createMany({
      data: tripMembers.map((member) => ({
        placeId,
        tripMemberId: member.id,
        rating: null,
        comment: null,
      })),
    });

    return placeComments;
  }

  async updatePlaceComment({ placeCommentId, rating, comment }: { placeCommentId: number; rating?: number | null; comment?: string | null }) {
    const existingComment = await this.databaseService.placeComment.findUnique({
      where: {
        id: placeCommentId,
        isDeleted: false,
      },
    });

    if (!existingComment) {
      throw new HttpException('The placeComment is not found.', HttpStatus.NOT_FOUND);
    }

    const updatedComment = await this.databaseService.placeComment.update({
      where: {
        id: placeCommentId,
      },
      data: {
        ...(rating !== undefined && { rating }),
        ...(comment !== undefined && { comment }),
        updatedAt: new Date(),
      },
    });

    return updatedComment.id;
  }
}
