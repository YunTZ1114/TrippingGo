import { User } from "../users";

export enum TripFilter {
  RECOMMEND = "RECOMMEND",
  SAVED = "SAVED",
  MINE = "MINE",
}

export enum Role {
  VIEWER = "VIEWER",
  EDITOR = "EDITOR",
  CREATOR = "CREATOR",
}

export enum CheckListType {
  PREPARATION = "PREPARATION",
  SHOPPING = "SHOPPING",
}

type Creator = Omit<User, "email">;

export type BaseTrip = {
  name: string;
  description: string;
  memberIds: number[];
  currencyCode: number;
  startTime: string;
  endTime: string;
};

export type Trip = BaseTrip & {
  id: number;
  creator: Creator;
  memberAmount: number;
  places: string[];
  likeAmount: number;
  savedAmount: number;
  isLike: boolean;
  isSaved: boolean;
  coverUrl?: string;
  updatedAt: string;
};

export type Member = {
  id: number;
  userId: number;
  nickname: string;
  userName: string;
  description?: string;
  note?: string;
  avatar?: string;
  role: Role;
};

export type TripDetail = {
  trip: Omit<BaseTrip, "memberIds"> & {
    id: number;
    creatorId: number;
    coverUrl?: string | null;
  };
  tripMembers: Member[];
};

export type BaseCheckListItem = {
  description: string[];
  title: string;
  type: CheckListType;
  isPublic: boolean;
};

export type BaseCheckListItemWithId = BaseCheckListItem & {
  id: number;
};

export type CheckListItem = Omit<BaseCheckListItem, "description"> & {
  id: number;
  description: { text: string; checked: boolean }[];
};

export interface BaseReservation {
  type: string;
  title: string;
  reservationTime: string;
  endTime?: string | null;
  tripMemberId: number;
  placeId?: number;
  placeName?: string | null;
  amount: number;
  note?: string | null;
  description?: string | null;
}

export interface Reservation extends BaseReservation {
  id: number;
  updatedAt: string;
}
