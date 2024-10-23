"use client";

import { api } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageBlock } from "../components";
import { Button, Form, Input, Select, TextArea, useForm } from "@/components";
import { useEffect, useState } from "react";
import { BaseTrip } from "@/api/trips";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { DatePicker, Switch } from "antd";
import dayjs, { Dayjs } from "dayjs";

type FormData = Omit<BaseTrip, "startTime" | "endTime" | "memberIds"> & {
  date: [Dayjs, Dayjs];
  isPublic?: boolean;
};

const SettingPage = ({ params }: { params: { tripId: string } }) => {
  const { data } = useQuery({
    queryKey: api.trips.keys.tripDetail(params.tripId),
    queryFn: () =>
      api.trips.getTripDetail({ pathParams: { tripId: +params.tripId } }),
  });

  const currencies = useQuery({
    queryKey: api.info.keys.currencies(),
    queryFn: api.info.currencies,
    gcTime: Infinity,
  });

  const [form] = useForm<FormData>();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const queryClient = useQueryClient();
  const putTripAction = useMutation({
    mutationFn: api.trips.put,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: api.trips.keys.tripDetail(params.tripId),
      });
    },
  });

  const handleFinish = ({ date, isPublic, ...value }: FormData) => {
    const startTime = date[0].format("YYYY-MM-DD");
    const endTime = date[1].format("YYYY-MM-DD");

    putTripAction.mutate({
      pathParams: { tripId: +params.tripId },
      data: {
        startTime,
        endTime,
        ...value,
      },
    });
  };

  useEffect(() => {
    if (!data) return;
    const { name, description, currencyCode, startTime, endTime } = data.trip;

    form.setFieldsValue({
      name,
      description,
      currencyCode,
      date: [dayjs(startTime), dayjs(endTime)],
    });
  }, [data]);

  return (
    <PageBlock
      title="旅途設定"
      description="基本設定們"
      extra={
        <Button
          onClick={() => {
            setHasSubmitted(true);
            form.submit();
          }}
          type="primary"
          size="large"
          icon={<MaterialSymbol icon="save" />}
        >
          儲存
        </Button>
      }
    >
      <Form
        layout="horizontal"
        validateTrigger={hasSubmitted ? "onChange" : "onSubmit"}
        form={form}
        onFinish={handleFinish}
        className="max-w-[400px]"
      >
        <Form.Item rules={[{ required: true }]} name="name" label="名稱">
          <Input size="large" variant="filled" />
        </Form.Item>
        <Form.Item rules={[{ required: true }]} name="description" label="描述">
          <TextArea rows={2} size="large" variant="filled" />
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
        <Form.Item name="isPublic" label="公開">
          <Switch />
        </Form.Item>
      </Form>
    </PageBlock>
  );
};

export default SettingPage;
