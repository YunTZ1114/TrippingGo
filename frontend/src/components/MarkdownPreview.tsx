import { classNames } from "@/utils";
import { Input } from "antd";
import React from "react";
import ReactMarkdown from "react-markdown";

type MarkdownPreview = React.ComponentProps<typeof ReactMarkdown>;

export const MarkdownPreview = ({
  children,
  className,
  ...props
}: MarkdownPreview) => {
  return (
    <ReactMarkdown
      className={classNames("prose prose-blue", className)}
      {...props}
    >
      {children}
    </ReactMarkdown>
  );
};

export const MarkdownEditor = ({
  value,
  onChange,
  isPreview,
  ...props
}: React.ComponentProps<typeof Input.TextArea> & { isPreview?: boolean }) => {
  return (
    <div className="relative">
      {isPreview && (
        <MarkdownPreview className="absolute border p-4 border-gray-300 rounded-lg inset-0 overflow-auto">
          {value as string}
        </MarkdownPreview>
      )}
      <Input.TextArea
        className={classNames(isPreview && "opacity-0")}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};
