import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BaseReservation } from 'src/types/reservation.type';

@Injectable()
export class ReservationService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getReservations(tripId: number) {
    const reservations = await this.databaseService.reservation.findMany({
      where: {
        tripMember: {
          tripId,
        },
        isDeleted: false,
      },
    });

    return reservations.map(({ isDeleted, createdAt, ...other }) => {
      return { ...other };
    });
  }

  async createReservation({ type, title, reservationTime, endTime, tripMemberId, amount, note, description }: BaseReservation) {
    const reservation = await this.databaseService.reservation.create({
      data: {
        type,
        title,
        reservationTime,
        endTime,
        tripMemberId,
        amount,
        note,
        description,
      },
    });

    return reservation.id;
  }

  async updateReservation(
    reservationId: number,
    { type, title, reservationTime, endTime, amount, note, description }: Omit<BaseReservation, 'tripMemberId'>,
  ) {
    const reservation = await this.databaseService.reservation.findUnique({
      where: {
        id: reservationId,
        isDeleted: false,
      },
    });

    if (!reservation) throw new Error('The reservation is not found.');

    await this.databaseService.reservation.update({
      where: { id: reservationId },
      data: {
        type,
        title,
        reservationTime,
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

    if (!reservation) throw new Error('The reservation is not found.');

    await this.databaseService.reservation.update({
      where: { id: reservationId },
      data: { isDeleted: true },
    });

    return reservation.id;
  }
}
