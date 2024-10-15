import {
  Button as AntdButton,
  type ButtonProps as AntdButtonProps,
} from "antd";
import { forwardRef } from "react";

interface ButtonProps extends AntdButtonProps {}

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(({ children, ...props }, ref) => {
  const childrenClass = (() => {
    switch (props.size) {
      case "large":
        return "text-label-large";
      case "small":
        return "text-label-small";
      case "middle":
      default:
        return "text-label-medium";
    }
  })();

  return (
    <AntdButton ref={ref} {...props}>
      <span className={childrenClass}>{children}</span>
    </AntdButton>
  );
});
