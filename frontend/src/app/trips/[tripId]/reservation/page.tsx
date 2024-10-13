"use client";
import { api } from "@/api";
import { Loading } from "@/components";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { ReservationBlock } from "./reservationBlock";
import { useState } from "react";
import { AddReservationModal, EditReservationModal } from "./modal";
import { Reservation } from "@/api/trips";
import { DeleteConfineModal } from "./modal/DeleteConfineModal";

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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex h-full flex-col px-10 pt-7">
      <div className="flex gap-2">
        <div className="w-full">
          <div className="text-headline-large font-bold">預約資訊</div>
          <div className="mt-5 text-body-large">
            包括購買門票、機票預訂、住宿安排和餐廳預約，它可以幫助您記錄不同類型的預約。
          </div>
        </div>

        <div>
          <Button
            onClick={() => setOpenModal({ type: ModalType.NEW })}
            type="primary"
            size="large"
            icon={<MaterialSymbol icon="add" />}
          >
            新增
          </Button>
        </div>
      </div>

      <div className="mt-3 flex h-0 flex-[1_1_0] flex-col gap-4 overflow-auto p-1 pb-6">
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
      </div>

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
    </div>
  );
};

export default ReservationPage;
