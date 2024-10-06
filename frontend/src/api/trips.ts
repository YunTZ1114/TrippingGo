import { baseInstance } from "./instance";
import { APIRequestConfig, APIResponseData } from "./interface";
import type { User } from "./users";

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

export enum Filter {
  RECOMMEND = "recommend",
  SAVED = "saved",
  MINE = "mine",
}

export const get = async ({
  params,
}: APIRequestConfig<{ q?: string; filter?: Filter }>) => {
  const url = "/trips";
  const res = await baseInstance.get<APIResponseData<Trip[]>>(url, { params });
  return res.data.data;
};

export const post = async ({ data }: APIRequestConfig<never, BaseTrip>) => {
  const url = "/trips";
  const res = await baseInstance.post<APIResponseData<{ tripId: number }>>(
    url,
    data
  );
  return res.data.data;
};
