import { baseInstance } from "../instance";
import { APIRequestConfig, APIResponseData } from "../interface";

export const placeKeys = {
  place: (tripId: number) => ["trips", tripId, "place"] as const,
  placeComment: (tripId: number, placeId: number) =>
    ["trips", tripId, "place", placeId, "comment"] as const,
};

export const foodIcons = [
  "restaurant",
  "lunch_dining",
  "cake",
  "local_cafe",
  "fastfood",
  "local_bar",
  "bakery_dining",
  "ramen_dining",
  "local_dining",
  "icecream",
  "dinner_dining",
  "brunch_dining",
  "kebab_dining",
  "grocery",
  "emoji_food_beverage",
] as const;

export const trafficIcons = [
  "directions_car",
  "flight",
  "directions_walk",
  "directions_bus",
  "train",
  "directions_bike",
  "pedal_bike",
  "directions_boat",
  "local_taxi",
  "sailing",
  "tram",
  "motorcycle",
  "snowmobile",
  "gondola_lift",
] as const;

export const otherIcons = ["flag"] as const;

export const markerIcons = [
  "flag",
  ...trafficIcons,
  ...foodIcons,
  ...otherIcons,
] as const;

export type MarkerIconType = (typeof markerIcons)[number];

export interface BasePlace {
  locationLat: number;
  locationLng: number;
  name: string;
  weekdayText: string[];
  googleMapUrl: string;
  googlePlaceId: string;
  address: string;
}

export interface PlaceAttributes {
  duration?: number | null;
  cost?: number | null;
  rating?: number;
  icon?: MarkerIconType;
}

export interface Place extends BasePlace, PlaceAttributes {
  id: number;
  tripId: number;
  updatedAt: string;
}

export interface PlaceCommentAttributes {
  comment: string | null;
  rating: number | null;
}

export interface PlaceComment extends PlaceCommentAttributes {
  id: number;
  tripMemberId: number;
  isOwner: boolean;
  updatedAt: Date;
}

export const getPlaces = async ({
  pathParams,
}: APIRequestConfig<never, never, { tripId: number }>) => {
  const url = `/trips/${pathParams?.tripId}/places`;
  const res = await baseInstance.get<APIResponseData<Place[]>>(url);
  return res.data.data;
};

export const postPlace = async ({
  pathParams,
  data,
}: APIRequestConfig<never, BasePlace, { tripId: number }>) => {
  const url = `/trips/${pathParams?.tripId}/places`;
  const res = await baseInstance.post<APIResponseData<{ id: number }>>(
    url,
    data,
  );
  return res.data.data;
};

export const putPlace = async ({
  pathParams,
  data,
}: APIRequestConfig<
  never,
  PlaceAttributes,
  { tripId: number; placeId: number }
>) => {
  const url = `/trips/${pathParams?.tripId}/places/${pathParams?.placeId}`;
  const res = await baseInstance.put<APIResponseData>(url, data);
  return res.data.data;
};

export const deletePlace = async ({
  pathParams,
}: APIRequestConfig<never, never, { tripId: number; placeId: number }>) => {
  const url = `/trips/${pathParams?.tripId}/places/${pathParams?.placeId}`;
  const res = await baseInstance.delete<APIResponseData>(url);
  return res.data.data;
};

export const getPlaceComments = async ({
  pathParams,
}: APIRequestConfig<never, never, { tripId: number; placeId: number }>) => {
  const url = `/trips/${pathParams?.tripId}/places/${pathParams?.placeId}/placeComments`;
  const res = await baseInstance.get<APIResponseData<PlaceComment[]>>(url);
  return res.data.data;
};

export const putPlaceComments = async ({
  pathParams,
  data,
}: APIRequestConfig<
  never,
  PlaceCommentAttributes,
  { tripId: number; placeId: number; placeCommentId: number }
>) => {
  const url = `/trips/${pathParams?.tripId}/places/${pathParams?.placeId}/placeComments/${pathParams?.placeCommentId}`;
  const res = await baseInstance.put<APIResponseData>(url, data);
  return res.data.data;
};
