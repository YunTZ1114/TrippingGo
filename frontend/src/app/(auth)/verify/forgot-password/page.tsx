import { api } from "@/api";
import { redirect } from "next/navigation";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { Avatar } from "antd";

const VerifyForgotPassword = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const code = searchParams?.code;
  if (!code || typeof code !== "string") redirect("/verify/fail");

  const { avatar, name, email, token } = await api.auth
    .verifyForgotPassword({ data: { code } })
    .catch(() => {
      redirect("/verify/fail");
    });

  return (
    <>
      <div className="flex flex-col items-center text-display-medium font-extrabold">
        重設密碼
      </div>
      <div className="text-center">
        <Avatar src={avatar} size={72} />
        <div className="text-title-large">{name}</div>
        <div>({email})</div>
      </div>
      <div className="text-center text-gray-400">
        歡迎回來
        <br />
        請輸入新密碼以重設您的密碼
      </div>
      <ResetPasswordForm token={token} />
    </>
  );
};

export default VerifyForgotPassword;
