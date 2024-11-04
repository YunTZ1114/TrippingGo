import { baseInstance } from "../instance";
import { APIRequestConfig, APIResponseData } from "../interface";

export const placeKeys = {
  place: (tripId: number) => ["trips", tripId, "place"] as const,
  placeComment: (tripId: number, placeId: number) =>
    ["trips", tripId, "place", placeId, "comment"] as const,
};

export const sportIcons = [
  "hiking",
  "downhill_skiing",
  "ice_skating",
  "roller_skating",
  "skateboarding",
  "kayaking",
  "kitesurfing",
  "surfing",
  "scuba_diving",
  "pool",
  "phishing",
  "fitness_center",
  "paragliding",
  "sports_golf",
  "sports_soccer",
  "sports_volleyball",
  "sports_basketball",
  "sports_baseball",
  "sports_football",
  "sports_tennis",
] as const;

export const attractionIcons = [
  "park",
  "forest",
  "landscape_2",
  "beach_access",
  "cabin",
  "camping",
  "pets",
  "raven",
  "owl",
  "onsen",
  "bath_outdoor",
  "festival",
  "attractions",
  "theater_comedy",
  "casino",
  "sports_esports",
  "museum",
  "local_activity",
  "church",
  "temple_buddhist",
  "fort",
  "mosque",
] as const;

export const foodIcons = [
  "restaurant",
  "local_dining",
  "breakfast_dining",
  "brunch_dining",
  "lunch_dining",
  "dinner_dining",
  "fastfood",
  "ramen_dining",
  "rice_bowl",
  "kebab_dining",
  "set_meal",
  "local_pizza",
  "bakery_dining",
  "cake",
  "icecream",
  "grocery",
  "emoji_food_beverage",
  "local_cafe",
  "liquor",
  "local_bar",
  "sports_bar",
] as const;

export const trafficIcons = [
  "directions_walk",
  "pedal_bike",
  "directions_bike",
  "motorcycle",
  "directions_car",
  "local_taxi",
  "directions_bus",
  "train",
  "tram",
  "gondola_lift",
  "snowmobile",
  "sailing",
  "directions_boat",
  "flight",
] as const;

export const storeIcons = [
  "local_convenience_store",
  "store",
  "storefront",
  "redeem",
  "local_mall",
  "shopping_basket",
  "service_toolbox",
  "apparel",
] as const;

export const otherIcons = [
  "luggage",
  "photo_camera",
  "bed",
  "wc",
  "local_laundry_service",
  "local_gas_station",
  "ev_station",
  "local_hospital",
  "local_pharmacy",
  "local_police",
  "flag",
  "bookmark",
  "star",
  "favorite",
  "skull",
] as const;

export const markerIcons = [
  "flag",
  ...attractionIcons,
  ...sportIcons,
  ...trafficIcons,
  ...foodIcons,
  ...storeIcons,
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
