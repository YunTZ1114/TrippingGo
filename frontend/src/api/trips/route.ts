import { baseInstance } from "../instance";
import { APIRequestConfig, APIResponseData } from "../interface";

export enum TravelMode {
  BICYCLING = "BICYCLING",
  DRIVING = "DRIVING",
  TRANSIT = "TRANSIT",
  WALKING = "WALKING",
}

interface PathPoint {
  lat: number;
  lng: number;
}

export interface BaseRoute {
  startingPointId?: number;
  destinationId?: number;
  travelMode: TravelMode;
  duration: number;
  distance: number;
  path: PathPoint[];
}

export const getRoutes = async ({
  pathParams,
}: APIRequestConfig<never, never, { tripId: number }>) => {
  const url = `/trips/${pathParams?.tripId}/routes`;
  const res = await baseInstance.get<APIResponseData<BaseRoute[]>>(url);
  return res.data.data;
};

export const postRoute = async ({
  pathParams,
  data,
}: APIRequestConfig<never, BaseRoute, { tripId: number }>) => {
  const url = `/trips/${pathParams?.tripId}/routes`;
  const res = await baseInstance.post<APIResponseData<{ id: number }>>(
    url,
    data,
  );
  return res.data.data;
};

export const putRoute = async ({
  pathParams,
  data,
}: APIRequestConfig<never, BaseRoute, { tripId: number; routeId: number }>) => {
  const url = `/trips/${pathParams?.tripId}/routes/${pathParams?.routeId}`;
  const res = await baseInstance.post<APIResponseData<{ id: number }>>(
    url,
    data,
  );
  return res.data.data;
};

export const deleteRoute = async ({
  pathParams,
}: APIRequestConfig<never, never, { tripId: number; routeId: number }>) => {
  const url = `/trips/${pathParams?.tripId}/routes/${pathParams?.routeId}`;
  const res = await baseInstance.delete<APIResponseData<{ id: number }>>(url);
  return res.data.data;
};
