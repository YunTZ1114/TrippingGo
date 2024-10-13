import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { TripGuard } from 'src/trips/trip.guard';
import { ReservationService } from './reservation.service';
import { ReservationDto } from './reservation.dto';
import { RequiredPermission } from 'src/decorators/required-permission.decorator';

@Controller('trips/:tripId/reservations')
@UseGuards(AuthGuard, TripGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('')
  @RequiredPermission(2)
  async getReservation(@Request() req) {
    const { tripId } = req;
    const reservations = await this.reservationService.getReservations(tripId);

    return { data: reservations };
  }

  @Post('')
  @RequiredPermission(2)
  async createReservation(@Request() req, @Body() reservationDto: ReservationDto) {
    const reservationId = await this.reservationService.createReservation(reservationDto);

    return { data: { reservationId } };
  }

  @Put('/:reservationId')
  @RequiredPermission(2)
  async updateReservation(@Param('reservationId') reservationId: number, @Body() reservationDto: ReservationDto) {
    await this.reservationService.updateReservation(reservationId, reservationDto);

    return {
      message: 'Update reservation in trip successfully',
    };
  }

  @Delete('/:reservationId')
  @RequiredPermission(2)
  async deleteReservation(@Param('reservationId') reservationId: number) {
    await this.reservationService.deleteReservation(reservationId);

    return {
      message: 'Delete reservation in trip successfully',
    };
  }
}
