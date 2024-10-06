"use client";

import {
  Alert,
  Button,
  Form,
  FormItem,
  Input,
  useAlert,
  useForm,
  Select,
  InputPassword,
} from "@/components";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/api";
import { getErrorMessage } from "@/api/utils";
import { SignUpSuccessModal } from "./modal";
import { useMutation, useQuery } from "@tanstack/react-query";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  countryId: string | null;
  gender: string | null;
};

const SignUp = () => {
  const [form] = useForm<FormData>();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const router = useRouter();
  const { props: alertProps, showAlert } = useAlert();

  const countries = useQuery({
    queryKey: api.info.keys.countries(),
    queryFn: api.info.countries,
    gcTime: Infinity,
  });

  const signUpAction = useMutation({
    mutationFn: api.auth.signUp,
    onError: (error) => {
      showAlert({
        type: "error",
        message: getErrorMessage(error, { 409: "帳號已註冊過" }),
      });
    },
    onSuccess: () => {
      setOpenModal(true);
    },
  });

  const countryOption = countries.data?.map(({ id, localName }) => ({
    label: localName,
    value: id,
  }));

  return (
    <>
      <div className="mb-5 text-headline-large">
        加入我們，規劃屬於你的旅行！
      </div>
      <Button className="w-full rounded-full" size="large">
        使用Google帳號註冊
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
        onFinish={({ confirmPassword, ...data }) =>
          signUpAction.mutate({ data })
        }
        initialValues={{ countryId: null, gender: null }}
      >
        <FormItem
          name="email"
          rules={[
            { required: true, message: "請輸入信箱" },
            { type: "email", message: "請填寫正確email格式" },
          ]}
          label={<span className="text-title-medium">信箱</span>}
        >
          <Input size="large" placeholder="bumi@example.com" variant="filled" />
        </FormItem>
        <FormItem
          name="name"
          rules={[{ required: true, message: "請輸入用戶名稱" }]}
          label={<span className="text-title-medium">用戶名稱</span>}
        >
          <Input size="large" variant="filled" />
        </FormItem>
        <div className="flex gap-2">
          <FormItem
            name="countryId"
            label={<span className="text-title-medium">國家</span>}
            className="w-full"
          >
            <Select
              showSearch
              size="large"
              variant="filled"
              className="w-full"
              loading={countries.isLoading}
              options={countryOption}
            />
          </FormItem>
          <FormItem
            name="gender"
            label={<span className="text-title-medium">性別</span>}
            className="w-full"
          >
            <Select
              size="large"
              variant="filled"
              className="w-full"
              options={[
                { label: "男", value: "male" },
                { label: "女", value: "female" },
                { label: "不提供", value: null },
              ]}
            />
          </FormItem>
        </div>
        <FormItem
          name="password"
          rules={[
            { required: true, message: "請輸入密碼" },
            { type: "string", min: 6, message: "密碼最少六個字" },
          ]}
          label={<span className="text-title-medium">密碼</span>}
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
          label={<span className="text-title-medium">再次輸入密碼</span>}
        >
          <InputPassword />
        </FormItem>
      </Form>
      <Button
        type="primary"
        className="w-full rounded-full"
        size="large"
        loading={signUpAction.isPending}
        onClick={() => {
          setHasSubmitted(true);
          form.submit();
        }}
      >
        註冊
      </Button>
      <div>
        已經有帳號了？
        <Link href={"/login"}>
          <Button type="link" size="large" className="h-auto p-0">
            點此登入
          </Button>
        </Link>
      </div>
      {/* ---------------- Modal ---------------- */}
      <SignUpSuccessModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          router.push("/login");
        }}
      />
    </>
  );
};

export default SignUp;
