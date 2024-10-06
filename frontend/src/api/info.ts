import { baseInstance } from "./instance";
import { APIResponseData } from "./interface";

export const keys = {
  countries: () => ["countries"],
  currencies: () => ["currencies"],
};

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

export type Currency = {
  id: number;
  code: string;
  exchangeRate: number;
  baseCurrency: boolean;
};

export const currencies = async () => {
  const url = "/currencies";
  const res = await baseInstance.get<APIResponseData<Currency[]>>(url);
  return res.data.data;
};
