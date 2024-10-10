import { baseInstance } from "../instance";
import { APIRequestConfig, APIResponseData } from "../interface";

export const memberKeys = {
  members: (tripId: number) => ["trips", tripId, "member"],
};

export enum Role {
  VIEWER = "VIEWER",
  EDITOR = "EDITOR",
  CREATOR = "CREATOR",
}

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

export const getMembers = async ({
  pathParams,
}: APIRequestConfig<never, never, { tripId: number }>) => {
  const url = `/trips/${pathParams?.tripId}/trip-members`;
  const res = await baseInstance.get<APIResponseData<Member[]>>(url);
  return res.data.data;
};

export const postMembers = async ({
  pathParams,
  data,
}: APIRequestConfig<
  never,
  { memberIds: number[]; permission: number },
  { tripId: number }
>) => {
  const url = `/trips/${pathParams?.tripId}/trip-members`;
  const res = await baseInstance.post<APIResponseData<Member[]>>(url, data);
  return res.data.data;
};

export const putMembers = async ({
  pathParams,
  data,
}: APIRequestConfig<
  never,
  {
    info: Partial<Member>[];
    permissions: { id: number; permissions: Role }[];
  },
  { tripId: number }
>) => {
  const url = `/trips/${pathParams?.tripId}/trip-members`;
  const res = await baseInstance.put<APIResponseData<Member[]>>(url, data);
  return res.data.data;
};

export const deleteMembers = async ({
  pathParams,
}: APIRequestConfig<never, never, { tripId: number; memberId: number }>) => {
  const url = `/trips/${pathParams?.tripId}/trip-members/${pathParams?.memberId}`;
  const res = await baseInstance.delete<APIResponseData>(url);
  return res.data.data;
};
