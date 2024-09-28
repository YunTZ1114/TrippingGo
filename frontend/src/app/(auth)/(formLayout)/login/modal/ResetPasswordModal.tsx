import { api } from "@/api";
import { getErrorMessage } from "@/api/utils";
import {
  Alert,
  Button,
  Form,
  FormItem,
  Input,
  useAlert,
  useForm,
} from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { useMountApi } from "@/hooks";
import { Modal } from "antd";
import { AxiosError } from "axios";
import { useState } from "react";

type FormData = { email: string };

export const ResetPasswordModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [form] = useForm<FormData>();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { loading, mount } = useMountApi();
  const { showAlert, props: alertProps } = useAlert();

  const handleFinish = async (data: FormData) => {
    const [success, error] = await mount(() =>
      api.auth.forgotPassword({ data })
    );

    if (error || !success) {
      showAlert({
        type: "error",
        message: getErrorMessage(error, { 400: "此帳號還沒註冊呦" }),
      });
      return;
    }
    showAlert({
      type: "success",
      message: "重設密碼信件已寄出！可能要等幾分鐘，請確認您的信箱～",
    });
  };

  return (
    <Modal
      classNames={{ content: "px-14 pb-14 pt-10" }}
      open={open}
      onCancel={onClose}
      destroyOnClose
      footer={null}
    >
      <div className="flex justify-center items-center gap-2 text-primary">
        <MaterialSymbol icon="key" size={72} />
        <MaterialSymbol icon="close" size={48} />
        <MaterialSymbol icon="lock" fill size={72} />
      </div>
      <div className="text-[36px] font-bold mb-5 text-primary text-center">
        忘記密碼
      </div>
      <div className="text-body-large text-gray-400">
        {"想不起來密碼設什麼了嗎？"}
        <br />
        {"不用擔心 >.o 在下方框框輸入註冊時的Email"}
        <br />
        {"馬上幫你進行重設密碼流程！"}
      </div>
      <Alert {...alertProps} className="mt-5" />
      <Form
        validateTrigger={hasSubmitted ? "onChange" : "onSubmit"}
        form={form}
        layout="vertical"
        className="mt-5 mb-10"
        onFinish={handleFinish}
      >
        <FormItem
          name="email"
          validateFirst
          rules={[
            { required: true, message: "帳號為必填項目" },
            { type: "email", message: "請填寫正確email格式" },
          ]}
          label={<span className="text-title-medium">帳號：</span>}
        >
          <Input size="large" placeholder="bumi@example.com" variant="filled" />
        </FormItem>
      </Form>
      <Button
        className="w-full rounded-full"
        size="large"
        onClick={() => {
          setHasSubmitted(true);
          form.submit();
        }}
        loading={loading}
      >
        寄送重設密碼信件
      </Button>
    </Modal>
  );
};
