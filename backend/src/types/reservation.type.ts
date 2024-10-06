import { CommonFields } from './common.type';

export interface BaseReservation {
  type: string;
  title: string;
  reservationTime: Date;
  endTime?: Date;
  tripMemberId: number;
  amount: number;
  note?: string;
  description?: string;
}

export interface Reservation extends BaseReservation, CommonFields {
  id: number;
}
