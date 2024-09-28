import { AxiosError } from "axios";

export const getErrorMessage = (
  error: unknown,
  customMessage?: Record<number, string>,
) => {
  if (error instanceof AxiosError && error.status) {
    return (
      customMessage?.[error.status] ?? `未知的錯誤 [錯誤代碼：${error.status}]`
    );
  }
  return "伺服器錯誤";
};
