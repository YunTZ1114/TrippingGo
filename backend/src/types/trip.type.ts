import { CommonFields } from './common.type';
import { UserPreview } from './user.type';

export interface BaseTrip {
  id: number;
  name: string;
  description: string;
  creatorId: number;
  currencyId: number;
  startTime: Date;
  endTime: Date;
  coverUrl?: string;
}

export interface Trip extends BaseTrip, CommonFields {}

export interface TripPreview extends Omit<BaseTrip, 'creatorId'> {
  creator: UserPreview;
  memberAmount: number;
  updatedAt: Date;
}

export enum TripFilterType {
  RECOMMEND = 'RECOMMEND',
  SAVED = 'SAVED',
  MINE = 'MINE',
}
