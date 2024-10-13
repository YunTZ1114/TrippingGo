import { api } from "@/api";
import { BaseReservation, Reservation } from "@/api/trips";
import { Button, Form, useForm } from "@/components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { ReservationForm } from "./ReservationForm";

type FormData = Omit<BaseReservation, "reservationTime" | "endTime"> & {
  time: { reservationTime: Dayjs; endTime: Dayjs; hasEndTime: boolean };
};

export const AddReservationModal = ({
  tripId,
  data: reservation,
  open,
  onClose,
}: {
  open: boolean;
  data?: Reservation;
  tripId: number;
  onClose: () => void;
}) => {
  const [form] = useForm<FormData>();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const queryClient = useQueryClient();

  const postReservationAction = useMutation({
    mutationFn: api.trips.postReservations,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries({
        queryKey: api.trips.keys.reservation(tripId),
      });
    },
  });

  const handleFinish = ({ time, ...value }: FormData) => {
    const { reservationTime, endTime } = time;

    postReservationAction.mutate({
      pathParams: { tripId },
      data: {
        reservationTime: reservationTime.toDate(),
        endTime: endTime.toDate(),
        ...value,
      },
    });
  };

  useEffect(() => {
    if (!reservation || !open) return;
    const { reservationTime, endTime, ...data } = reservation;
    const initialValues = {
      time: {
        reservationTime: dayjs(reservationTime),
        hasEndTime: !!endTime,
        endTime: endTime && dayjs(endTime),
      },
      ...data,
    };
    form.resetFields();
    form.setFieldsValue(initialValues);
  }, [reservation, open]);

  return (
    <Modal
      classNames={{ content: "px-10 pb-14 pt-5" }}
      open={open}
      onCancel={onClose}
      destroyOnClose
      title="新增預約資訊"
      footer={null}
    >
      <Form
        layout="vertical"
        validateTrigger={hasSubmitted ? "onChange" : "onSubmit"}
        form={form}
        onFinish={handleFinish}
      >
        <ReservationForm tripId={tripId} />
      </Form>
      <Button
        size="large"
        type="primary"
        className="mt-5 w-full rounded-full"
        loading={postReservationAction.isPending}
        onClick={() => {
          setHasSubmitted(true);
          form.submit();
        }}
      >
        新增
      </Button>
    </Modal>
  );
};
