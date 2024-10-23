import { baseInstance } from "../instance";
import { APIRequestConfig, APIResponseData } from "../interface";
import { BaseReservation, Reservation } from "./interfaces";

export const reservationsKeys = {
  reservation: (tripId: number) => ["trips", tripId, "reservation"] as const,
};

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
