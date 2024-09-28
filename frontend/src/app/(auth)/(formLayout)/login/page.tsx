"use client";
import {
  Alert,
  Button,
  Form,
  FormItem,
  Input,
  useAlert,
  useForm,
  InputPassword,
} from "@/components";
import { Checkbox } from "antd";
import Link from "next/link";
import { useState } from "react";
import { ResetPasswordModal } from "./modal";
import { api } from "@/api";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/api/utils";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { useMountApi } from "@/hooks";

type FormData = { email: string; password: string; stayLoggedIn: boolean };

const Login = () => {
  const [form] = useForm<FormData>();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { loading, mount } = useMountApi();

  const { props: alertProps, showAlert } = useAlert();
  const router = useRouter();

  const handleLogin = async (data: FormData) => {
    const [success, error] = await mount(() => api.auth.login({ data }));

    if (error || !success) {
      showAlert({
        type: "error",
        message: getErrorMessage(error, { 400: "帳號或密碼錯誤" }),
      });
      return;
    }

    localStorage.setItem("token", success.token);
    showAlert({ type: "success", message: "登入成功" });
    router.push("/");
  };

  return (
    <>
      <div className="mb-5 text-headline-large">開始跟朋友規劃一段旅行吧！</div>
      <Button className="w-full rounded-full" size="large">
        使用Google帳號登入
      </Button>
      <div className="flex items-center gap-3">
        <div className="w-full border-b border-b-gray-300" />
        或
        <div className="w-full border-b border-b-gray-300" />
      </div>

      <Alert {...alertProps} />

      <Form
        form={form}
        layout="vertical"
        validateTrigger={hasSubmitted ? "onChange" : "onSubmit"}
        onFinish={handleLogin}
        initialValues={{ stayLoggedIn: false }}
      >
        <FormItem
          name="email"
          rules={[
            { required: true, message: "請輸入帳號" },
            { type: "email", message: "請填寫正確email格式" },
          ]}
          label={<span className="text-title-medium">帳號</span>}
        >
          <Input size="large" placeholder="bumi@example.com" variant="filled" />
        </FormItem>
        <FormItem
          name="password"
          className="mb-2"
          rules={[
            { required: true, message: "請輸入密碼" },
            { type: "string", min: 6, message: "密碼最少六個字" },
          ]}
          label={<span className="text-title-medium">密碼</span>}
        >
          <InputPassword />
        </FormItem>
        <FormItem name="stayLoggedIn" noStyle valuePropName="checked">
          <Checkbox>
            <div className="text-title-small">保持登入狀態</div>
          </Checkbox>
        </FormItem>
      </Form>
      <Button
        type="primary"
        className="mt-5 w-full rounded-full"
        size="large"
        onClick={() => {
          setHasSubmitted(true);
          form.submit();
        }}
        loading={loading}
      >
        登入
      </Button>
      <div className="flex flex-col items-start gap-2">
        <Button
          onClick={() => setOpenModal(true)}
          type="link"
          size="large"
          className="h-auto p-0"
        >
          忘記密碼
        </Button>
        <div>
          還沒有帳號？
          <Link href="/sign-up">
            <Button type="link" size="large" className="h-auto p-0">
              點此註冊
            </Button>
          </Link>
        </div>
        <Button
          type="link"
          size="large"
          className="mb-2 h-auto p-0"
          icon={<MaterialSymbol icon="language" />}
        >
          切換語言
        </Button>
      </div>

      {/* -------------------- modal -------------------- */}
      <ResetPasswordModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
};

export default Login;
