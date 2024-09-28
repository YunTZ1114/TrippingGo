"use client";

import { useCallback, useState } from "react";
import { AlertProps } from "./Alert";

type ShowAlertProps = Pick<AlertProps, "type" | "message">;

export const useAlert = () => {
  const [props, setProps] = useState<AlertProps>({});
  const showAlert = useCallback((v: ShowAlertProps) => {
    setProps({ ...v, show: true });
  }, []);

  return {
    props: { ...props, afterClose: () => setProps({}) },
    showAlert,
  };
};
