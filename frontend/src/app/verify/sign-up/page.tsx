"use client";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { api } from "@/api";
import { Button, Loading } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "@/hooks";

const VerifySignUp = () => {
  const { searchParams } = useSearchParams();
  const code = searchParams.get("code");

  const verifyData = useQuery({
    queryKey: api.auth.keys.verifySignUp(),
    queryFn: async () => {
      if (!code) throw new Error("code must be provide");
      await api.auth.verifySignUp({ data: { code } });
    },
    retry: false,
  });

  const router = useRouter();
  const [second, setSecond] = useState<number>(5);

  useEffect(() => {
    if (second === 0) {
      router.push("/login");
      return;
    }
    setTimeout(() => setSecond(second - 1), 1000);
  }, [second]);

  if (verifyData.isLoading) return <Loading />;
  if (!verifyData.data) redirect("/verify/fail");

  return (
    <>
      <div className="flex flex-col items-center text-display-medium font-extrabold text-green-500">
        <MaterialSymbol size={120} icon="task_alt" />
        註冊成功
      </div>
      <div className="text-center text-gray-400">
        email驗證成功，您已成功註冊成為 tripping Go! 會員
        <br />
        將會在 {second}
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
