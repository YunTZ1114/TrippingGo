import { baseInstance } from "../instance";
import { APIRequestConfig, APIResponseData } from "../interface";
import type { User } from "../users";
import { BaseTrip, Member, Trip, TripDetail, TripFilter } from "./interfaces";

export const baseKeys = {
  all: () => ["trips"],
  tripDetail: (id: string) => ["trips", id],
};

export const get = async ({
  params,
}: APIRequestConfig<{ q?: string; filter?: TripFilter }>) => {
  const url = "/trips";
  const res = await baseInstance.get<APIResponseData<Trip[]>>(url, { params });
  return res.data.data;
};

export const post = async ({ data }: APIRequestConfig<never, BaseTrip>) => {
  const url = "/trips";
  const res = await baseInstance.post<APIResponseData<{ tripId: number }>>(
    url,
    data,
  );
  return res.data.data;
};

export const put = async ({
  pathParams,
  data,
}: APIRequestConfig<never, Partial<BaseTrip>, { tripId: number }>) => {
  const url = `/trips/${pathParams?.tripId}`;
  const res = await baseInstance.put<APIResponseData<{ tripId: number }>>(
    url,
    data,
  );
  return res.data.data;
};

export const patch = async ({
  pathParams,
  data,
}: APIRequestConfig<never, { isPublic: boolean }, { tripId: number }>) => {
  const url = `/trips/${pathParams?.tripId}`;
  const res = await baseInstance.patch<APIResponseData<{ tripId: number }>>(
    url,
    data,
  );
  return res.data.data;
};

export const getTripDetail = async ({
  pathParams,
}: APIRequestConfig<never, never, { tripId: number }>) => {
  const url = `/trips/${pathParams?.tripId}`;
  const res = await baseInstance.get<APIResponseData<TripDetail>>(url);
  return res.data.data;
};
