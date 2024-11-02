import { CommonFields } from './common.type';

export interface BasePlace {
  id: number;
  tripId: number;
  locationLat: number;
  locationLng: number;
  name: string;
  weekdayText: string[];
  googleMapUrl?: string;
  googlePlaceId?: string;
  address?: string;
}

export interface PlaceAttributes {
  duration?: number;
  cost?: number;
  rating?: number;
  icon: string;
}

export interface Place extends BasePlace, PlaceAttributes, CommonFields {}
