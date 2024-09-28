import {
  Button as AntdButton,
  type ButtonProps as AntdButtonProps,
} from "antd";

interface ButtonProps extends AntdButtonProps {}

export const Button = ({ children, ...props }: ButtonProps) => {
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
    <AntdButton {...props}>
      <span className={childrenClass}>{children}</span>
    </AntdButton>
  );
};
