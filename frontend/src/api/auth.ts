import { baseInstance } from "./instance";
import type { APIRequestConfig, APIResponseData } from "./interface";

export const keys = {
  verifySignUp: () => ["verify", "signUp"],
  verifyForgotPassword: () => ["verify", "ForgotPassword"],
};

export const login = async ({
  data,
}: APIRequestConfig<never, { email: string; password: string }>) => {
  const url = "/auth/login";
  const res = await baseInstance.post<APIResponseData<{ token: string }>>(
    url,
    data,
  );
  return res.data.data;
};

export const googleLogin = async ({
  data,
}: APIRequestConfig<never, { credential: string }>) => {
  const url = "/auth/google-login";
  const res = await baseInstance.post<APIResponseData<{ token: string }>>(
    url,
    data,
  );
  return res.data.data;
};

export const forgotPassword = async ({
  data,
}: APIRequestConfig<never, { email: string }>) => {
  const url = "/auth/forgot-password";
  const res = await baseInstance.post<APIResponseData>(url, data);
  return res.data;
};

export const signUp = async ({
  data,
}: APIRequestConfig<
  never,
  {
    email: string;
    password: string;
    name: string;
    countryId: string | null;
    gender: string | null;
  }
>) => {
  const url = "/auth/sign-up";
  const res = await baseInstance.post<
    APIResponseData<{
      message: string;
      userId: number;
    }>
  >(url, data);
  return res.data;
};

export const verifySignUp = async ({
  data,
}: APIRequestConfig<never, { code: string }>) => {
  const url = `/auth/verify-sign-up?code=${data?.code}`;
  const res = await baseInstance.get<APIResponseData<{ message: string }>>(url);
  return res.data;
};

export const verifyForgotPassword = async ({
  data,
}: APIRequestConfig<never, { code: string }>) => {
  const url = `/auth/verify-forgot-password?code=${data?.code}`;
  const res = await baseInstance.get<
    APIResponseData<{
      token: string;
      email: string;
      name: string;
      avatar: string;
    }>
  >(url);
  return res.data.data;
};

export const resetPassword = async ({
  data,
}: APIRequestConfig<never, { password: string; token: string }>) => {
  const url = "/auth/reset-password";
  const res = await baseInstance.post<APIResponseData<{ message: string }>>(
    url,
    { password: data?.password },
    { headers: { ["Authorization"]: `Bearer ${data?.token}` } },
  );
  return res.data;
};
