import { Input as AntInput, InputProps as AntInputProps, InputRef } from "antd";
import { forwardRef } from "react";

export interface InputProps extends AntInputProps {}

export const Input = forwardRef(
  ({ ...props }: InputProps, ref: React.LegacyRef<InputRef>) => {
    return <AntInput ref={ref} {...props} />;
  },
);

Input.displayName = "Input";
