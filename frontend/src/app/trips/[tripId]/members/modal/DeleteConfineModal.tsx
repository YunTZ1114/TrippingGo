import { api } from "@/api";
import { Member } from "@/api/trips";
import { Button } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "antd";

export const DeleteConfineModal = ({
  tripId,
  state,
  open,
  onClose,
}: {
  tripId: number;
  state?: Member;
  open: boolean;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const deleteMembersAction = useMutation({
    mutationFn: api.trips.deleteMembers,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: api.trips.keys.members(tripId),
      });
      onClose();
    },
  });

  return (
    <Modal
      classNames={{ content: "px-14 pb-14 pt-10" }}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <div className="flex items-center justify-center gap-2 text-red-500">
        <MaterialSymbol icon="warning" size={72} />
      </div>
      <div className="mb-5 text-center text-[36px] font-bold text-red-500">
        移除確認
      </div>
      <div className="text-center text-body-large text-gray-400">
        確定要把
        <span className="font-bold text-gray-600">「{state?.userName}」</span>
        從旅程移除嗎
      </div>
      <div className="mt-5 flex justify-center gap-2">
        <Button type="default" size="large" onClick={onClose}>
          取消
        </Button>
        <Button
          loading={deleteMembersAction.isPending}
          type="primary"
          size="large"
          onClick={() => {
            if (!state) return;
            deleteMembersAction.mutate({
              pathParams: { tripId: tripId, memberId: state.id },
            });
          }}
        >
          確認
        </Button>
      </div>
    </Modal>
  );
};
