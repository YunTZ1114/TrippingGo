import { CommonFields } from './common.type';

export enum PermissionsText {
  DELETED = 0,
  PENDING = 1,
  VIEWER = 2,
  EDITOR = 3,
  CREATOR = 4,
}

export enum AssignablePermissions {
  VIEWER = 'VIEWER',
  EDITOR = 'EDITOR',
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
