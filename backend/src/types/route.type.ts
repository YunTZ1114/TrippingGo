import { CommonFields } from './common.type';

export type TravelMode = 'BICYCLING' | 'DRIVING' | 'TRANSIT' | 'WALKING';

export interface BaseRoute {
  startingPointId?: number;
  destinationId?: number;
  travelMode: TravelMode;
  duration: number;
  distance: number;
  path: { lat: number; lng: number }[];
}

export interface Route extends BaseRoute, CommonFields {
  id: number;
}
