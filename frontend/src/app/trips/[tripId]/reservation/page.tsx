"use client";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { ReservationBlock } from "./reservationBlock";
import { useState } from "react";
import { AddReservationModal, EditReservationModal } from "./modal";
import { Reservation } from "@/api/trips";
import { DeleteConfineModal } from "./modal/DeleteConfineModal";
import { PageBlock } from "../components";

enum ModalType {
  NEW = "new",
  EDIT = "edit",
  DELETE = "delete",
}

const ReservationPage = ({ params }: { params: { tripId: number } }) => {
  const [openModal, setOpenModal] = useState<{
    type: ModalType;
    data?: Reservation;
  } | null>(null);

  const { data: reservations, isLoading } = useQuery({
    queryKey: api.trips.keys.reservation(params.tripId),
    queryFn: async () =>
      await api.trips.getReservations({
        pathParams: { tripId: params.tripId },
      }),
  });

  return (
    <>
      <PageBlock
        isLoading={isLoading}
        isEmpty={!reservations?.length}
        title="預約資訊"
        description="包括購買門票、機票預訂、住宿安排和餐廳預約，它可以幫助您記錄不同類型的預約。"
        extra={
          <Button
            onClick={() => setOpenModal({ type: ModalType.NEW })}
            type="primary"
            size="large"
            icon={<MaterialSymbol icon="add" />}
          >
            新增
          </Button>
        }
        contentClassName="flex-col"
      >
        {reservations?.map((reservation) => (
          <ReservationBlock
            onEdit={() =>
              setOpenModal({ type: ModalType.EDIT, data: reservation })
            }
            onCopy={() =>
              setOpenModal({ type: ModalType.NEW, data: reservation })
            }
            onDelete={() => {
              setOpenModal({ type: ModalType.DELETE, data: reservation });
            }}
            key={reservation.id}
            reservation={reservation}
          />
        ))}
      </PageBlock>

      <AddReservationModal
        open={openModal?.type === ModalType.NEW}
        data={openModal?.data}
        tripId={params.tripId}
        onClose={() => setOpenModal(null)}
      />

      <EditReservationModal
        open={openModal?.type === ModalType.EDIT}
        data={openModal?.data}
        tripId={params.tripId}
        onClose={() => setOpenModal(null)}
      />

      <DeleteConfineModal
        open={openModal?.type === ModalType.DELETE}
        tripId={params.tripId}
        data={openModal?.data}
        onClose={() => setOpenModal(null)}
      />
    </>
  );
};

export default ReservationPage;
