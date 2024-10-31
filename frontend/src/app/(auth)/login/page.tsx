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
import { useMutation } from "@tanstack/react-query";
import { baseInstance } from "@/api/instance";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";

type FormData = { email: string; password: string; stayLoggedIn: boolean };

const Login = () => {
  const [form] = useForm<FormData>();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { props: alertProps, showAlert } = useAlert();
  const router = useRouter();

  const loginAction = useMutation({
    mutationFn: api.auth.login,
    onError: (error) => {
      showAlert({
        type: "error",
        message: getErrorMessage(error, { 400: "帳號或密碼錯誤" }),
      });
    },
    onSuccess: (success) => {
      localStorage.setItem("token", success.token);
      baseInstance.defaults.headers.common["Authorization"] =
        `Bearer ${success.token}`;
      showAlert({ type: "success", message: "登入成功" });
      router.push("/");
    },
  });

  const googleLoginAction = useMutation({
    mutationFn: api.auth.googleLogin,
    onError: (error) => {
      showAlert({
        type: "error",
        message: getErrorMessage(error, { 400: "查無此帳號" }),
      });
    },
    onSuccess: (success) => {
      localStorage.setItem("token", success.token);
      baseInstance.defaults.headers.common["Authorization"] =
        `Bearer ${success.token}`;
      showAlert({ type: "success", message: "登入成功" });
      router.push("/");
    },
  });

  const handleLoginSuccess = async (res: CredentialResponse) => {
    if (res.credential) {
      googleLoginAction.mutate({ data: { credential: res.credential } });
    }
  };

  return (
    <>
      <div className="mb-5 text-headline-large">開始跟朋友規劃一段旅行吧！</div>
      <div className="flex w-full items-center justify-center">
        <GoogleOAuthProvider
          clientId={`${process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ID}`}
        >
          <GoogleLogin
            width="400"
            theme="outline"
            shape="pill"
            type="standard"
            onSuccess={handleLoginSuccess}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </GoogleOAuthProvider>{" "}
      </div>

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
        onFinish={(data) => loginAction.mutate({ data })}
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
        loading={loginAction.isPending}
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
