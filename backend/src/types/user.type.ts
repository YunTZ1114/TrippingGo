// import { CommonFields } from './common.type';

export enum GenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export type UserPreview = {
  id: number;
  avatar: string | null;
  name: string;
};

export type User = {
  email: string;
  password: string;
  name: string;
  countryId: number;
  gender: GenderType;
  avatar: string | null;
  isVerified: boolean;
};
