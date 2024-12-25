// import { CommonFields } from './common.type';

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
  gender: string;
  avatar: string | null;
  isVerified: boolean;
};
