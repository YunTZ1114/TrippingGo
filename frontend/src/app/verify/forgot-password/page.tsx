"use client";
import { api } from "@/api";
import { redirect } from "next/navigation";
import { Avatar } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loading } from "@/components";

import {
  Alert,
  Button,
  Form,
  FormItem,
  useAlert,
  useForm,
  InputPassword,
} from "@/components";
import { getErrorMessage } from "@/api/utils";
import { useRouter } from "next/navigation";

type FromData = { password: string; confirmPassword: string };

const VerifyForgotPassword = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const code = searchParams?.code;
  if (!code || typeof code !== "string") redirect("/verify/fail");

  const verifyData = useQuery({
    queryKey: api.auth.keys.verifyForgotPassword(),
    queryFn: api.auth.verifyForgotPassword,
    retry: false,
  });

  if (verifyData.isLoading) return <Loading />;
  if (!verifyData.data || verifyData.isError) redirect("/verify/fail");

  const { props: alertProps, showAlert } = useAlert();
  const { avatar, name, email, token } = verifyData.data;
  const router = useRouter();
  const [form] = useForm<FromData>();
  const resetPasswordAction = useMutation({
    mutationFn: api.auth.resetPassword,
    onError: (error) => {
      showAlert({
        type: "error",
        message: getErrorMessage(error, { 400: "新密碼不得與舊密碼一樣" }),
      });
    },
    onSuccess: () => {
      showAlert({
        type: "success",
        message: "重設密碼成功，幫您跳回登入頁面...",
      });
      router.push("/login");
    },
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
      <Form
        form={form}
        layout="vertical"
        className="w-full"
        validateTrigger="onChange"
        onFinish={({ password }) =>
          resetPasswordAction.mutate({ data: { password, token } })
        }
      >
        <Alert {...alertProps} className="mb-5" />
        <FormItem
          name="password"
          rules={[
            { required: true, message: "請輸入密碼" },
            { type: "string", min: 6, message: "密碼最少六個字" },
          ]}
          label={<span className="text-title-medium">新密碼</span>}
        >
          <InputPassword />
        </FormItem>
        <FormItem
          name="confirmPassword"
          dependencies={["password"]}
          required
          rules={[
            ({ getFieldValue }) => ({
              validator: async () => {
                const password = getFieldValue("password");
                const confirmPassword = getFieldValue("confirmPassword");
                if (password !== confirmPassword) {
                  throw new Error("兩次密碼不同，請重新確認");
                }
              },
            }),
          ]}
          label={<span className="text-title-medium">再次輸入新密碼</span>}
        >
          <InputPassword />
        </FormItem>
      </Form>
      <Button
        type="primary"
        className="w-full rounded-full"
        size="large"
        loading={resetPasswordAction.isPending}
        onClick={form.submit}
      >
        重設密碼
      </Button>
    </>
  );
};

export default VerifyForgotPassword;
