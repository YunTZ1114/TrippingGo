import { Button } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { Modal } from "antd";

export const SignUpSuccessModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal
      classNames={{ content: "px-14 pb-14 pt-10" }}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <div className="flex items-center justify-center gap-2 text-green-500">
        <MaterialSymbol icon="check_circle" size={72} />
      </div>
      <div className="mb-5 text-center text-[36px] font-bold text-green-500">
        註冊成功！
      </div>
      <div className="text-body-large text-gray-400">
        {"請確認你的信箱有沒有收到信件～"}
        <br />
        {"點擊信件連結驗證信箱"}
      </div>
      <div className="flex justify-center">
        <Button className="mt-5 rounded-full" size="large" onClick={onClose}>
          確認
        </Button>
      </div>
    </Modal>
  );
};
