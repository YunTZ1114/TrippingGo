import { api } from "@/api";
import { BaseTrip } from "@/api/trips";
import { User } from "@/api/users";
import { getErrorMessage } from "@/api/utils";
import {
  Button,
  Form,
  Input,
  Select,
  type SelectProps,
  useAlert,
  useForm,
} from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Avatar, DatePicker, Modal } from "antd";
import { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const UserLabel = ({ name, avatar, email }: User) => (
  <div className="flex gap-2">
    <Avatar size={36} icon={name[0].toUpperCase()} src={avatar} />
    <div>
      <div>{name}</div>
      <div className="text-body-small">{email}</div>
    </div>
  </div>
);

const UserTag = ({ name, avatar, onClose }: User & { onClose: () => void }) => (
  <div
    className="flex bg-gray-200 gap-2 items-center p-1 rounded-full my-1 mr-1"
    onClick={(e) => e.stopPropagation()}
  >
    <Avatar
      className="bg-primary"
      size={24}
      icon={name[0].toUpperCase()}
      src={avatar}
    />
    {name}
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      className="rounded-full hover:bg-gray-400/50 transition-all p-[2px] cursor-pointer flex"
    >
      <MaterialSymbol icon="close" size={20} />
    </div>
  </div>
);

const UserSelect = ({ value, ...props }: SelectProps) => {
  const [searchValue, setSearchValue] = useState("");

  const users = useQuery({
    queryFn: async () =>
      await api.users.get({
        params: { q: searchValue, limit: 5 + (value?.length ?? 0) },
      }),
    queryKey: api.users.keys.get({ searchValue, value }),
  });

  const userOption = useMemo(() => {
    if (!users.data) return [];
    const valueSet = new Set(value?.map((v: string) => JSON.parse(v).id));
    const filterData = users.data.filter(({ id }) => !valueSet.has(id));
    return filterData.slice(0, 5).map((data) => ({
      value: JSON.stringify(data),
      label: <UserLabel {...data} />,
    }));
  }, [users.data]);

  return (
    <Select
      {...props}
      value={value}
      onBlur={() => setSearchValue("")}
      options={userOption}
      tagRender={({ value, onClose }) => {
        if (!value) return <div />;
        const data = JSON.parse(value);
        return <UserTag {...data} onClose={onClose} />;
      }}
      mode="multiple"
      loading={users.isLoading}
      onSearch={setSearchValue}
      size="large"
      variant="filled"
    />
  );
};

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
