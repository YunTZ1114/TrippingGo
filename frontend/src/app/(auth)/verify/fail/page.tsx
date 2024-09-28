import { Button } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import Link from "next/link";

const VerifyFail = () => {
  return (
    <>
      <div className="flex flex-col items-center text-red-600 text-display-medium font-extrabold">
        <MaterialSymbol size={120} icon="warning" />
        連結已失效
      </div>
      <div className="text-center text-gray-400">還沒想到描述</div>
      <Link href="/login">
        <Button type="primary" size="large">
          前往登入頁面
        </Button>
      </Link>
    </>
  );
};

export default VerifyFail;
