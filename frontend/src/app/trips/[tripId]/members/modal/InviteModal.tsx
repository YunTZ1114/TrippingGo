import { useState } from "react";
import { DatePicker, Modal } from "antd";
import { Dayjs } from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/api";
import { BaseTrip, Role } from "@/api/trips";
import { Button, Form, Input, Select, useForm, UserSelect } from "@/components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MAP_ROLE_TO_TEXT, ROLE_OPTIONS } from "../constants";

type FormData = Omit<BaseTrip, "startTime" | "endTime" | "memberIds"> & {
  members?: string[];
  permission: number;
};

export const InviteModal = ({
  tripMembersId,
  open,
  onClose,
}: {
  tripMembersId: number[];
  open: boolean;
  onClose: () => void;
}) => {
  const [form] = useForm<FormData>();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { tripId } = useParams<{ tripId: string }>();

  const queryClient = useQueryClient();

  const postMemberAction = useMutation({
    mutationFn: api.trips.postMembers,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: api.trips.keys.members(+tripId),
      });
      onClose();
    },
  });

  const handleFinish = ({ permission, members }: FormData) => {
    postMemberAction.mutate({
      pathParams: { tripId: +tripId },
      data: {
        permission,
        memberIds:
          members?.map((v: string) => JSON.parse(v).id as number) ?? [],
      },
    });
  };

  return (
    <Modal
      classNames={{ content: "px-10 pb-14 pt-5" }}
      open={open}
      onCancel={onClose}
      destroyOnClose
      title="邀請成員"
      footer={null}
    >
      <Form
        layout="vertical"
        validateTrigger={hasSubmitted ? "onChange" : "onSubmit"}
        form={form}
        onFinish={handleFinish}
      >
        <Form.Item rules={[{ required: true }]} name="name" label="權限">
          <Select
            size="large"
            variant="filled"
            options={ROLE_OPTIONS.filter(({ value }) => value !== Role.CREATOR)}
          />
        </Form.Item>
        <Form.Item rules={[{ required: true }]} name="members" label="使用者">
          <UserSelect expectUserId={tripMembersId} />
        </Form.Item>
      </Form>
      <Button
        type="primary"
        className="w-full rounded-full mt-5"
        size="large"
        loading={postMemberAction.isPending}
        onClick={() => {
          setHasSubmitted(true);
          form.submit();
        }}
      >
        寄送邀請
      </Button>
    </Modal>
  );
};
