import { classNames } from "@/utils";
import { Alert as AntdAlert, type AlertProps as AntdAlertProps } from "antd";

export interface AlertProps extends AntdAlertProps {
  show?: boolean;
}

const getAlertClass = (type: AlertProps["type"]) => {
  switch (type) {
    case "error":
      return "text-red-700";
    case "info":
      return "text-blue-700";
    case "success":
      return "text-green-700";
    case "warning":
      return "text-orange-700";
    default:
      return "";
  }
};

export const Alert = ({ className, show, ...props }: AlertProps) => {
  if (!show) return null;
  return (
    <AntdAlert
      closable
      showIcon
      className={classNames(getAlertClass(props.type), className)}
      {...props}
    />
  );
};
