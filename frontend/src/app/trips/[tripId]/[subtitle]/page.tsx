"use client";
import { Button, Input } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";

const TmpPage = ({ params }: { params: { subtitle: string } }) => {
  return (
    <div className="flex flex-col h-full pt-7 px-10">
      {/* 上方資訊欄 */}
      <div className="flex gap-2">
        <div className="w-full">
          <div className="text-headline-large font-bold">
            {params.subtitle.toUpperCase()}
          </div>
          <div className="text-body-large mt-5">一串介紹的文字</div>
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
          className="bg-white border-none rounded-full max-w-[300px]"
        />
      </div>
      {/* 內容 */}
      <div className="mt-5 flex-[1_1_0] h-0 overflow-auto flex flex-col gap-2">
        {new Array(100).fill("").map((_, index) => (
          <div className="bg-white p-5 rounded-lg">框框 {index}</div>
        ))}
      </div>
    </div>
  );
};

export default TmpPage;
