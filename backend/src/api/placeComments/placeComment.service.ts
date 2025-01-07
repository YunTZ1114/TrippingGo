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

  async createPlaceCommentByTripMember(tripMemberIds: number[]) {
    const tripMembers = await this.databaseService.tripMember.findMany({
      where: {
        id: {
          in: tripMemberIds,
        },
        isDeleted: false,
      },
      select: {
        id: true,
        tripId: true,
      },
    });

    if (!tripMembers.length) {
      throw new HttpException('No trip members found or all are deleted', HttpStatus.NOT_FOUND);
    }

    const tripIds = [...new Set(tripMembers.map((member) => member.tripId))];

    const places = await this.databaseService.place.findMany({
      where: {
        tripId: {
          in: tripIds,
        },
        isDeleted: false,
      },
      select: {
        id: true,
        tripId: true,
      },
    });

    if (places.length === 0) {
      return 'No places found in these trips';
    }

    const commentsData = tripMembers.flatMap((member) =>
      places
        .filter((place) => place.tripId === member.tripId)
        .map((place) => ({
          placeId: place.id,
          tripMemberId: member.id,
          rating: null,
          comment: null,
        })),
    );

    const placeComments = await this.databaseService.placeComment.createMany({
      data: commentsData,
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

  async deletePlaceComment(placeId: number) {
    const deletePlaceComments = await this.databaseService.placeComment.updateMany({
      where: {
        placeId: placeId,
      },
      data: {
        isDeleted: true,
        updatedAt: new Date(),
      },
    });

    return deletePlaceComments.count;
  }

  async deletePlaceCommentByTripMember(tripMemberId: number) {
    const tripMember = await this.databaseService.tripMember.findUnique({
      where: {
        id: tripMemberId,
      },
    });

    if (!tripMember) {
      throw new HttpException('Trip member not found or is deleted', HttpStatus.NOT_FOUND);
    }

    const deletePlaceComments = await this.databaseService.placeComment.updateMany({
      where: {
        tripMemberId,
      },
      data: {
        isDeleted: true,
        updatedAt: new Date(),
      },
    });

    return deletePlaceComments;
  }
}
