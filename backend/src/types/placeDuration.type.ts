import { CommonFields } from './common.type';

export interface BasePlaceDuration {
  placeId: number;
  date: string;
  col: number[];
  row: number;
  groupNumber?: number;
}

export interface PlaceDuration extends BasePlaceDuration, CommonFields {
  id: number;
}
