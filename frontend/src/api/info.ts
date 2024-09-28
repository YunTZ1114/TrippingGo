import { baseInstance } from "./instance";
import { APIResponseData } from "./interface";

export type Country = {
  id: number;
  localName: string;
  chName: string;
  enName: string;
};

export const countries = async () => {
  const url = "/countries";
  const res = await baseInstance.get<APIResponseData<Country[]>>(url);
  return res.data.data;
};
