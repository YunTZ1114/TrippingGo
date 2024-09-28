import Link from "next/link";
import { redirect } from "next/navigation";
import { api } from "@/api";
import { Button } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { CountDown } from "./CountDown";

const VerifySignUp = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const code = searchParams?.code;
  if (!code || typeof code !== "string") redirect("/verify/fail");
  await api.auth.verifySignUp({ data: { code } }).catch((err) => {
    redirect("/verify/fail");
  });

  return (
    <>
      <div className="flex flex-col items-center text-display-medium font-extrabold text-green-500">
        <MaterialSymbol size={120} icon="task_alt" />
        註冊成功
      </div>
      <div className="text-center text-gray-400">
        email驗證成功，您已成功註冊成為 tripping Go! 會員
        <br />
        將會在 <CountDown start={5} />
        秒後跳轉到登入頁
        <br />
        如果沒有自動跳轉請點擊下方按鈕移動
      </div>
      <Link href="/login">
        <Button type="primary" size="large">
          前往登入頁面
        </Button>
      </Link>
    </>
  );
};

export default VerifySignUp;
