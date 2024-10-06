import { baseInstance } from "./instance";
import { APIRequestConfig, APIResponseData } from "./interface";

export interface User {
  id: number;
  email: string;
  name: string;
  avatar: string;
}

export const keys = {
  all: () => ["user"],
  get: (query: any) => ["user", query],
  me: () => ["user", "me"],
};

export const get = async ({
  params,
}: APIRequestConfig<{ q?: string; limit?: number }>) => {
  const url = "/users";
  const res = await baseInstance.get<APIResponseData<User[]>>(url, { params });
  return res.data.data;
};

export const me = async () => {
  const url = "/users/me";
  const res = await baseInstance.get<APIResponseData<User>>(url);
  return res.data.data;
};
