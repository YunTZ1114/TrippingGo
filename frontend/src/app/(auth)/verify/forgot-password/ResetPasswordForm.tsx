"use client";
import {
  Alert,
  Button,
  Form,
  FormItem,
  useAlert,
  useForm,
  InputPassword,
} from "@/components";
import { useMountApi } from "@/hooks";
import { api } from "@/api";
import { getErrorMessage } from "@/api/utils";
import { useRouter } from "next/navigation";

type FromData = { password: string; confirmPassword: string };

export const ResetPasswordForm = ({ token }: { token: string }) => {
  const [form] = useForm<FromData>();
  const { loading, mount } = useMountApi();
  const { props: alertProps, showAlert } = useAlert();
  const router = useRouter();

  const handleFinish = async ({ password }: FromData) => {
    const [success, err] = await mount(() =>
      api.auth.resetPassword({ data: { password, token } }),
    );
    if (err && !success) {
      showAlert({
        type: "error",
        message: getErrorMessage(err, { 400: "新密碼不得與舊密碼一樣" }),
      });
      return;
    }
    showAlert({
      type: "success",
      message: "重設密碼成功，幫您跳回登入頁面...",
    });
    router.push("/login");
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        className="w-full"
        validateTrigger="onChange"
        onFinish={handleFinish}
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
        loading={loading}
        onClick={() => {
          form.submit();
        }}
      >
        重設密碼
      </Button>
    </>
  );
};
