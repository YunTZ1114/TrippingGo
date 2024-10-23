import { baseInstance } from "../instance";
import { APIRequestConfig, APIResponseData } from "../interface";
import { BaseCheckListItem, CheckListItem } from "./interfaces";

export const checkListKeys = {
  checkList: (tripId: number) => ["trips", tripId, "checkList"],
};

export const getCheckList = async ({
  pathParams,
}: APIRequestConfig<never, never, { tripId: number }>) => {
  const url = `/trips/${pathParams?.tripId}/check-lists`;
  const res = await baseInstance.get<APIResponseData<CheckListItem[]>>(url);
  return res.data.data;
};

export const postCheckList = async ({
  data,
  pathParams,
}: APIRequestConfig<never, BaseCheckListItem, { tripId: number }>) => {
  const url = `/trips/${pathParams?.tripId}/check-lists`;
  const res = await baseInstance.post<APIResponseData<{ checkListId: number }>>(
    url,
    data,
  );
  return res.data.data;
};

export const putCheckList = async ({
  data,
  pathParams,
}: APIRequestConfig<
  never,
  BaseCheckListItem,
  { tripId: number; checkListId: number }
>) => {
  const url = `/trips/${pathParams?.tripId}/check-lists/${pathParams?.checkListId}`;
  const res = await baseInstance.put<APIResponseData>(url, data);
  return res.data.data;
};

export const patchCheckList = async ({
  data,
  pathParams,
}: APIRequestConfig<
  never,
  { descriptionKey: string },
  { tripId: number; checkListId: number }
>) => {
  const url = `/trips/${pathParams?.tripId}/check-lists/${pathParams?.checkListId}`;
  const res = await baseInstance.patch<APIResponseData>(url, data);
  return res.data.data;
};

export const deleteCheckList = async ({
  pathParams,
}: APIRequestConfig<
  never,
  { descriptionKey: string },
  { tripId: number; checkListId: number }
>) => {
  const url = `/trips/${pathParams?.tripId}/check-lists/${pathParams?.checkListId}`;
  const res = await baseInstance.delete<APIResponseData>(url);
  return res.data.data;
};
