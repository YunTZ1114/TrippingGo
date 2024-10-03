import { CommonFields } from './common.type';

export interface BaseTripMember {
  id: number;
  nickname: string;
  permissions: number;
  description?: Record<string, any>;
  note?: string;
}

export interface TripMember extends BaseTripMember, CommonFields {
  userId: number;
}
