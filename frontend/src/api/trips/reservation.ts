import { baseInstance } from "../instance";
import { APIRequestConfig, APIResponseData } from "../interface";

export const reservationsKeys = {
  reservation: (tripId: number) => ["trips", tripId, "reservation"] as const,
};

export interface BaseReservation {
  type: string;
  title: string;
  reservationTime: Date;
  endTime?: Date | null;
  tripMemberId: number;
  amount: number;
  note?: string;
  description?: string;
}

export interface Reservation extends BaseReservation {
  id: number;
  updatedAt: Date;
}

export const getReservations = async ({
  pathParams,
}: APIRequestConfig<never, never, { tripId: number }>) => {
  const url = `/trips/${pathParams?.tripId}/reservations`;
  const res = await baseInstance.get<APIResponseData<Reservation[]>>(url);
  return res.data.data;
};

export const postReservations = async ({
  pathParams,
  data,
}: APIRequestConfig<never, BaseReservation, { tripId: number }>) => {
  const url = `/trips/${pathParams?.tripId}/reservations`;
  const res = await baseInstance.post<APIResponseData<number>>(url, data);
  return res.data.data;
};

export const putReservations = async ({
  pathParams,
  data,
}: APIRequestConfig<
  never,
  BaseReservation,
  { tripId: number; reservationId: number }
>) => {
  const url = `/trips/${pathParams?.tripId}/reservations/${pathParams?.reservationId}`;
  const res = await baseInstance.put<APIResponseData<number>>(url, data);
  return res.data.data;
};

export const deleteReservations = async ({
  pathParams,
}: APIRequestConfig<
  never,
  never,
  { tripId: number; reservationId: number }
>) => {
  const url = `/trips/${pathParams?.tripId}/reservations/${pathParams?.reservationId}`;
  const res = await baseInstance.delete<APIResponseData<number>>(url);
  return res.data.data;
};
