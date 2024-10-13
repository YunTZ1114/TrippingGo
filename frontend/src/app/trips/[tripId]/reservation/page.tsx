"use client";
import { api } from "@/api";
import { Loading } from "@/components";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { ReservationBlock } from "./reservationBlock";
import { useState } from "react";
import { NewTripModal } from "@/app/(trip-list)/modal";
import { AddReservationModal } from "./modal";

const ReservationPage = ({ params }: { params: { tripId: number } }) => {
  const [openModal, setOpenModal] = useState(false);
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
    <div className="flex flex-col h-full pt-7 px-10">
      <div className="flex gap-2">
        <div className="w-full">
          <div className="text-headline-large font-bold">預約資訊</div>
          <div className="text-body-large mt-5">
            一串介紹的文字，多一點看起來比較正常 P.S
            但我不知道要多常看起來才正常...
          </div>
        </div>

        <div>
          <Button
            onClick={() => setOpenModal(true)}
            type="primary"
            size="large"
            icon={<MaterialSymbol icon="add" />}
          >
            新增
          </Button>
        </div>
      </div>

      <div className="mt-3 p-1 pb-6 flex-[1_1_0] h-0 overflow-auto flex flex-col gap-4">
        {reservations?.map((reservation) => (
          <ReservationBlock key={reservation.id} reservation={reservation} />
        ))}
      </div>
      <AddReservationModal
        open={openModal}
        tripId={params.tripId}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
};

export default ReservationPage;
