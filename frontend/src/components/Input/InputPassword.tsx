"use client";
import { Input, InputProps } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { useState } from "react";

export const InputPassword = ({ ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      size="large"
      variant="filled"
      type={showPassword ? "string" : "password"}
      suffix={
        <MaterialSymbol
          icon={showPassword ? "visibility_off" : "visibility"}
          className="cursor-pointer text-primary"
          onClick={() => setShowPassword((show) => !show)}
        />
      }
      {...props}
    />
  );
};
