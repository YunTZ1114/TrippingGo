import { classNames } from "@/utils";
import React, { ReactHTMLElement, ReactNode, ReactPropTypes } from "react";

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Tag = ({ className, children, ...props }: TagProps) => {
  return (
    <div
      className={classNames(
        "flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1 text-xs text-white shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
