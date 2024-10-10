import { useState } from "react";
import { DatePicker, Modal } from "antd";
import { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { api } from "@/api";
import { BaseTrip } from "@/api/trips";
import { Button, Form, Input, Select, useForm, UserSelect } from "@/components";
import { useMutation, useQuery } from "@tanstack/react-query";

type FormData = Omit<BaseTrip, "startTime" | "endTime" | "memberIds"> & {
  members?: string[];
  date: [Dayjs, Dayjs];
};

export const NewTripModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const currencies = useQuery({
    queryKey: api.info.keys.currencies(),
    queryFn: api.info.currencies,
    gcTime: Infinity,
  });

  const [form] = useForm<FormData>();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const router = useRouter();

  const postTripAction = useMutation({
    mutationFn: api.trips.post,
    onSuccess: ({ tripId }) => {
      router.push(`/trips/${tripId}`);
    },
  });

  const handleFinish = ({ date, members, ...value }: FormData) => {
    const startTime = date[0].format("YYYY-MM-DD");
    const endTime = date[1].format("YYYY-MM-DD");

    postTripAction.mutate({
      data: {
        startTime,
        endTime,
        memberIds:
          members?.map((v: string) => JSON.parse(v).id as number) ?? [],
        ...value,
      },
    });
  };

  return (
    <Modal
      classNames={{ content: "px-10 pb-14 pt-5" }}
      open={open}
      onCancel={onClose}
      destroyOnClose
      title="建立新旅行"
      footer={null}
    >
      <Form
        layout="vertical"
        validateTrigger={hasSubmitted ? "onChange" : "onSubmit"}
        form={form}
        onFinish={handleFinish}
      >
        <Form.Item rules={[{ required: true }]} name="name" label="名稱">
          <Input size="large" variant="filled" />
        </Form.Item>
        <Form.Item rules={[{ required: true }]} name="description" label="描述">
          <Input size="large" variant="filled" />
        </Form.Item>
        <Form.Item name="members" label="成員">
          <UserSelect />
        </Form.Item>
        <Form.Item rules={[{ required: true }]} name="date" label="日期">
          <DatePicker.RangePicker
            allowClear={false}
            size="large"
            className="w-full"
            variant="filled"
          />
        </Form.Item>
        <Form.Item
          rules={[{ required: true }]}
          name="currencyCode"
          label="預設幣值"
        >
          <Select
            showSearch
            size="large"
            variant="filled"
            loading={currencies.isLoading}
            options={currencies.data?.map(({ code, id }) => ({
              label: code,
              value: code,
            }))}
          />
        </Form.Item>
      </Form>
      <Button
        type="primary"
        className="w-full rounded-full mt-5"
        size="large"
        loading={postTripAction.isPending}
        onClick={() => {
          setHasSubmitted(true);
          form.submit();
        }}
      >
        建立
      </Button>
    </Modal>
  );
};
