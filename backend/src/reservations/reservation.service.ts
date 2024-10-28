import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BaseReservation } from 'src/types/reservation.type';

@Injectable()
export class ReservationService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getReservation({ tripId, placeId }: { tripId: number; placeId: number }) {
    const reservations = await this.databaseService.reservation.findMany({
      where: {
        tripMember: {
          tripId,
        },
        placeId,
        isDeleted: false,
      },
      include: {
        place: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return reservations.map(({ isDeleted, createdAt, place, ...other }) => {
      return { placeName: place.name, ...other };
    });
  }

  async getReservations(tripId: number) {
    const reservations = await this.databaseService.reservation.findMany({
      where: {
        tripMember: {
          tripId,
        },
        isDeleted: false,
      },
      include: {
        place: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return reservations.map(({ isDeleted, createdAt, place, ...other }) => {
      return { placeName: place.name, ...other };
    });
  }

  async createReservation({ type, title, reservationTime, endTime, tripMemberId, placeId, amount, note, description }: BaseReservation) {
    const reservation = await this.databaseService.reservation.create({
      data: {
        type,
        title,
        reservationTime,
        endTime,
        tripMemberId,
        placeId,
        amount,
        note,
        description,
      },
    });

    return reservation.id;
  }

  async updateReservation(
    reservationId: number,
    { type, title, reservationTime, endTime, placeId, amount, note, description }: Omit<BaseReservation, 'tripMemberId'>,
  ) {
    const reservation = await this.databaseService.reservation.findUnique({
      where: {
        id: reservationId,
        isDeleted: false,
      },
    });

    if (!reservation) throw new HttpException('The reservation is not found.', HttpStatus.NOT_FOUND);

    await this.databaseService.reservation.update({
      where: { id: reservationId },
      data: {
        type,
        title,
        reservationTime,
        placeId,
        endTime,
        amount,
        note,
        description,
      },
    });

    return reservation.id;
  }

  async deleteReservation(reservationId: number) {
    const reservation = await this.databaseService.reservation.findUnique({
      where: {
        id: reservationId,
        isDeleted: false,
      },
    });

    if (!reservation) throw new HttpException('The reservation is not found.', HttpStatus.NOT_FOUND);

    await this.databaseService.reservation.update({
      where: { id: reservationId },
      data: { isDeleted: true },
    });

    return reservation.id;
  }
}
