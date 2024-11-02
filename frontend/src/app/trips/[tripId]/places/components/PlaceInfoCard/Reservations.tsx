import { Reservation } from "@/api/trips";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { scheduler } from "timers/promises";
import { mappingTagValue } from "../../../constants";
import { Loading, MarkdownPreview } from "@/components";
import { Fragment } from "react";
import { Divider } from "antd";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

const ReservationInfo = ({ reservation }: { reservation: Reservation }) => {
  const startDate = new Date(reservation.reservationTime);
  const endDate = reservation.endTime ? new Date(reservation.endTime) : null;

  const startTime = startDate.toLocaleString("zh-TW", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const endTime = endDate
    ? startDate.toLocaleDateString("zh-TW") ===
      endDate.toLocaleDateString("zh-TW")
      ? endDate.toLocaleTimeString("zh-TW", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : endDate.toLocaleString("zh-TW", {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
    : null;

  const time = endTime ? `${startTime} ~ ${endTime}` : startTime;

  return (
    <div>
      <div className="flex flex-col gap-2">
        <span className="text-xl font-bold">{reservation.title}</span>
        <div className="flex gap-2 text-gray-400">
          <div className="flex items-center gap-1">
            <MaterialSymbol icon="schedule" size={16} />
            {time}
          </div>
          {reservation.amount && (
            <div className="flex items-center gap-1">
              <MaterialSymbol icon="group" size={16} />
              {reservation.amount}
            </div>
          )}
          <div className="flex items-center gap-1">
            <MaterialSymbol icon="sell" size={16} />
            {mappingTagValue[reservation.type as keyof typeof mappingTagValue]}
          </div>
        </div>
      </div>
      <div className="my-4">
        <div className="flex items-center text-red-600">
          <MaterialSymbol icon="error" size={16} fill />
          <div className="px-1 text-label-medium font-bold">注意事項</div>
        </div>
        <div className="mt-1 rounded-lg bg-red-50 p-4">
          <MarkdownPreview className="text-xs">
            {reservation.note}
          </MarkdownPreview>
        </div>
      </div>

      <div>
        <div className="flex items-center text-yellow-600">
          <MaterialSymbol icon="sms" size={16} />
          <div className="text-label-mediums px-1 font-bold">描述</div>
        </div>
        <div className="mt-1 rounded-lg bg-yellow-50 p-4">
          <MarkdownPreview className="text-xs">
            {reservation.description}
          </MarkdownPreview>
        </div>
      </div>
    </div>
  );
};
export const Reservations = ({
  tripId,
  placeId,
}: {
  tripId: number;
  placeId: number;
}) => {
  const { data: reservations, isLoading } = useQuery({
    queryKey: api.trips.keys.placeReservation(tripId, placeId),
    queryFn: async () =>
      await api.trips.getReservations({
        pathParams: { tripId },
        params: { placeId },
      }),
  });

  return (
    <div className="flex flex-col gap-2">
      {isLoading ? (
        <Loading />
      ) : (
        reservations?.map((reservation, i) => (
          <Fragment key={reservation.id}>
            {!!i && <Divider />}
            <ReservationInfo reservation={reservation} />
          </Fragment>
        ))
      )}
    </div>
  );
};
