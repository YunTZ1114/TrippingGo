import { CommonFields } from './common.type';

export enum PlaceType {
  TRANSPORTATION = 'TRANSPORTATION',
  ACCOMMODATION = 'ACCOMMODATION',
  RESTAURANT = 'RESTAURANT',
  HEALTH_BEAUTY = 'HEALTH_BEAUTY',
  ENTERTAINMENT = 'ENTERTAINMENT',
  OUTDOOR_ACTIVITY = 'OUTDOOR_ACTIVITY',
  OTHER = 'OTHER',
}

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
  type?: PlaceType;
  duration?: number;
  cost?: number;
  rating?: number;
}

export interface Place extends BasePlace, PlaceAttributes, CommonFields {}
