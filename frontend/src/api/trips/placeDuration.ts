import { baseInstance } from "../instance";
import { APIRequestConfig, APIResponseData } from "../interface";

export const placeDurationKeys = {
  placeDuration: (tripId: number) =>
    ["trips", tripId, "placeDuration"] as const,
};

interface BasePlaceDuration {
  placeId: number;
  date: string;
  col: number[];
  row: number;
  groupNumber?: number | null;
}

interface PlaceDuration extends BasePlaceDuration {
  id: number;
}

export const getPlaceDurations = async ({
  pathParams,
}: APIRequestConfig<never, never, { tripId: number }>) => {
  const url = `/trips/${pathParams?.tripId}/place-durations`;
  const res = await baseInstance.get<APIResponseData<PlaceDuration[]>>(url);
  return res.data.data;
};

export const postPlaceDuration = async ({
  pathParams,
  data,
}: APIRequestConfig<never, BasePlaceDuration, { tripId: number }>) => {
  const url = `/trips/${pathParams?.tripId}/place-durations`;
  const res = await baseInstance.post<APIResponseData<{ id: number }>>(
    url,
    data,
  );
  return res.data.data;
};

export const putPlaceDuration = async ({
  pathParams,
  data,
}: APIRequestConfig<
  never,
  Omit<BasePlaceDuration, "placeId">,
  { tripId: number; placeDurationId: number }
>) => {
  const url = `/trips/${pathParams?.tripId}/place-durations/${pathParams?.placeDurationId}`;
  const res = await baseInstance.put<APIResponseData>(url, data);
  return res.data.data;
};

export const deletePlaceDuration = async ({
  pathParams,
}: APIRequestConfig<
  never,
  never,
  { tripId: number; placeDurationId: number }
>) => {
  const url = `/trips/${pathParams?.tripId}/place-durations/${pathParams?.placeDurationId}`;
  const res = await baseInstance.delete<APIResponseData>(url);
  return res.data.data;
};
