import { api } from "@/api";
import { BaseReservation } from "@/api/trips";
import {
  Button,
  Form,
  Input,
  MarkdownEditor,
  Select,
  type SelectProps,
  useForm,
} from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Checkbox,
  DatePicker,
  InputNumber,
  Modal,
  Tooltip,
} from "antd";
import { Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import { mappingTagValue } from "../../constants";

const UserSelect = ({
  value,
  tripId,
  ...props
}: SelectProps & { tripId: number }) => {
  const users = useQuery({
    queryFn: async () => await api.trips.getMembers({ pathParams: { tripId } }),
    queryKey: api.trips.keys.members(tripId),
  });

  const userOption = useMemo(() => {
    if (!users.data) return [];
    return users.data.map(({ id, userName, avatar }) => ({
      value: id,
      label: (
        <div className="flex items-center gap-2">
          <Avatar size={24} icon={userName[0].toUpperCase()} src={avatar} />
          <div>{userName}</div>
        </div>
      ),
    }));
  }, [users.data]);

  return (
    <Select
      {...props}
      value={value}
      options={userOption}
      loading={users.isLoading}
      variant="filled"
    />
  );
};

const DateTimePicker = ({
  value,
  onChange,
}: {
  value?: Date;
  onChange?: (value: Date) => void;
}) => {
  return (
    <div className="flex w-full items-center gap-4">
      <DatePicker
        allowClear={false}
        className="w-full bg-white"
        variant="filled"
        value={value}
        onChange={onChange}
      />
      <DatePicker.TimePicker
        format="HH:mm"
        allowClear={false}
        className="w-full bg-white"
        variant="filled"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

const ReservationTimePicker = () => {
  const hasEndTime = Form.useWatch(["time", "hasEndTime"]);
  return (
    <div className="rounded-lg bg-surfaceLight p-4">
      <div className="flex items-center gap-1 px-2 pb-2">開始時間</div>
      <Form.Item noStyle name={["time", "reservationTime"]}>
        <DateTimePicker />
      </Form.Item>

      <div className="flex items-center gap-2 p-2 pt-4">
        <Form.Item
          noStyle
          valuePropName="checked"
          name={["time", "hasEndTime"]}
        >
          <Checkbox className="-ml-2 flex-row-reverse">結束時間</Checkbox>
        </Form.Item>
      </div>
      {hasEndTime && (
        <Form.Item noStyle className="mb-0" name={["time", "endTime"]}>
          <DateTimePicker />
        </Form.Item>
      )}
    </div>
  );
};

export const ReservationForm = ({ tripId }: { tripId: number }) => {
  const [isNotePreview, setIsNotePreview] = useState(false);
  const [isDescriptionPreview, setIsDescriptionPreview] = useState(false);

  const { data: places } = useQuery({
    queryKey: api.trips.keys.place(tripId),
    queryFn: () => api.trips.getPlaces({ pathParams: { tripId: tripId } }),
  });

  return (
    <>
      <Form.Item
        rules={[{ required: true, message: "請輸入預約名稱" }]}
        name="title"
        label={<span className="text-title-medium">預約名稱</span>}
      >
        <Input variant="filled" maxLength={60} />
      </Form.Item>

      <Form.Item
        rules={[{ required: false, message: "請選擇地點" }]}
        name="placeId"
        label={<span className="text-title-medium">地點</span>}
      >
        <Select
          options={places?.map(({ id, name }) => ({
            label: name,
            value: id,
          }))}
        />
      </Form.Item>

      <Form.Item
        rules={[{ required: true, message: "請選擇預約類型" }]}
        name="type"
        label={<span className="text-title-medium">類型</span>}
      >
        <Select
          options={Object.entries(mappingTagValue).map(([key, value]) => ({
            label: value,
            value: key,
          }))}
        />
      </Form.Item>

      <Form.Item
        className=""
        rules={[
          { required: true },
          {
            validator: async (_, value) => {
              if (!value?.reservationTime) throw new Error("請選擇預約時間");
              if (value?.hasEndTime) {
                if (!value.endTime) throw new Error("請選擇結束時間");
                if (value.endTime <= value.reservationTime)
                  throw new Error("預約開始時間需小於結束時間");
              }
            },
          },
        ]}
        name="time"
        label={<span className="text-title-medium">時間</span>}
      >
        <ReservationTimePicker></ReservationTimePicker>
      </Form.Item>

      <div className="grid w-full grid-cols-2 gap-4">
        <Form.Item
          rules={[{ required: true, message: "請選擇預約人員" }]}
          name="tripMemberId"
          label={<span className="text-title-medium">預約者</span>}
        >
          <UserSelect tripId={tripId} />
        </Form.Item>

        <Form.Item
          rules={[{ required: true, message: "請選擇預約人數" }]}
          name="amount"
          label={<span className="text-title-medium">人數</span>}
        >
          <InputNumber
            className="w-full bg-surfaceLight"
            precision={0}
            min={1}
            step={1}
            variant="filled"
          />
        </Form.Item>
      </div>

      <Form.Item
        name="note"
        label={
          <div className="flex w-[999px] items-center justify-between">
            <div className="flex items-center justify-between gap-1">
              <span className="text-title-medium">注意事項</span>
              <Tooltip title="支援輸入md語法">
                <MaterialSymbol size={18} icon="error" />
              </Tooltip>
            </div>
            <Button
              size="small"
              onClick={() => {
                setIsNotePreview(!isNotePreview);
              }}
            >
              {isNotePreview ? "編輯" : "預覽"}
            </Button>
          </div>
        }
      >
        <MarkdownEditor isPreview={isNotePreview} variant="filled" />
      </Form.Item>

      <Form.Item
        name="description"
        label={
          <div className="flex w-[999px] items-center justify-between">
            <div className="flex items-center justify-between gap-1">
              <span className="text-title-medium">描述</span>
              <Tooltip title="支援輸入md語法">
                <MaterialSymbol size={18} icon="error" />
              </Tooltip>
            </div>
            <Button
              size="small"
              onClick={() => {
                setIsDescriptionPreview(!isDescriptionPreview);
              }}
            >
              {isDescriptionPreview ? "編輯" : "預覽"}
            </Button>
          </div>
        }
      >
        <MarkdownEditor isPreview={isDescriptionPreview} variant="filled" />
      </Form.Item>
    </>
  );
};
