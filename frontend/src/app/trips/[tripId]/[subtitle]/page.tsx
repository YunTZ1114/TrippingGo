"use client";
import { Button, Input } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";

const TmpPage = ({ params }: { params: { subtitle: string } }) => {
  return (
    <div className="flex h-full flex-col px-10 pt-7">
      {/* 上方資訊欄 */}
      <div className="flex gap-2">
        <div className="w-full">
          <div className="text-headline-large font-bold">
            {params.subtitle.toUpperCase()}
          </div>
          <div className="mt-5 text-body-large">一串介紹的文字</div>
        </div>

        <div>
          <Button
            type="primary"
            size="large"
            icon={<MaterialSymbol icon="add" />}
          >
            按鈕
          </Button>
        </div>
      </div>
      {/* 搜尋欄 */}
      <div className="mt-5">
        <Input
          placeholder="搜尋..."
          prefix={<MaterialSymbol icon="search" />}
          variant="filled"
          size="large"
          className="max-w-[300px] rounded-full border-none bg-white"
        />
      </div>
      {/* 內容 */}
      <div className="mt-5 flex h-0 flex-[1_1_0] flex-col gap-2 overflow-auto">
        {new Array(100).fill("").map((_, index) => (
          <div className="rounded-lg bg-white p-5">框框 {index}</div>
        ))}
      </div>
    </div>
  );
};

export default TmpPage;
