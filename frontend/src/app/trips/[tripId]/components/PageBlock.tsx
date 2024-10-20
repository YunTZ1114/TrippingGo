"use client";
import { Empty, Input, Loading } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { classNames } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";

interface PageBlockProps {
  title: React.ReactNode;
  description: React.ReactNode;
  extra?: React.ReactNode;
  showSearch?: boolean;
  isLoading?: boolean;
  isEmpty?: boolean;
  contentClassName?: string;
  className?: string;
  children: React.ReactNode;
}

export const PageBlock = ({
  title,
  description,
  extra,
  showSearch,
  isLoading,
  isEmpty,
  contentClassName,
  className,
  children,
}: PageBlockProps) => {
  const queryClient = useQueryClient();
  const isMutating = queryClient.isMutating();

  return (
    <div className={classNames("flex h-full flex-col px-10 pt-7", className)}>
      {/* 上方資訊欄 */}
      <div className="flex gap-2">
        <div className="w-full">
          <div className="text-headline-large font-bold">
            {title}
            {!!isMutating && (
              <MaterialSymbol
                icon="progress_activity"
                className="ml-2 animate-spin text-gray-400"
                weight={700}
                size={24}
              />
            )}
          </div>
          <div className="mt-5 text-body-large">{description}</div>
        </div>
        {extra}
      </div>
      {/* 搜尋欄 */}
      {/* TODO: handle onChange event */}
      {showSearch && (
        <div className="mt-5">
          <Input
            placeholder="搜尋..."
            prefix={<MaterialSymbol icon="search" />}
            variant="filled"
            size="large"
            className="max-w-[300px] rounded-full border-none bg-white"
          />
        </div>
      )}
      {/* 內容 */}
      <div
        className={classNames(
          "mt-5 flex h-0 flex-[1_1_0] flex-col gap-4 overflow-auto",
          contentClassName,
        )}
      >
        {(() => {
          if (isLoading) return <Loading colorClass="text-gray-400" />;
          if (isEmpty) return <Empty />;
          return children;
        })()}
      </div>
    </div>
  );
};
