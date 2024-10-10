import { CommonFields } from './common.type';

export enum PermissionsText {
  DELETED = 0,
  VIEWER = 1,
  EDITOR = 2,
  CREATOR = 3,
}

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
