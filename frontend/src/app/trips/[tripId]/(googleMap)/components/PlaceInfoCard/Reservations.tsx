import { Reservation } from "@/api/trips";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { scheduler } from "timers/promises";
import { mappingTagValue } from "../../../constants";
import { Loading, MarkdownPreview } from "@/components";
import { Fragment } from "react";
import { Divider } from "antd";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

const tripMemberData = [
  {
    id: 8,
    avatar:
      "https://lh3.googleusercontent.com/a/ACg8ocKM9eaA-2AsYaAG4VYo0Yd555L6de_jnja_7x24alyBzDBb6G9A=s96-c",
    nickname: "Rex",
    role: "CREATOR",
  },
  {
    id: 12,
    avatar: null,
    nickname: "Eva",
    role: "EDITOR",
  },
  {
    id: 15,
    avatar:
      "https://lh3.googleusercontent.com/a/ACg8ocI73v1mYLFYs3JYTVnisqZ6ZZOJGP6OsJ28QubQ8M5aADeoQF4A-Q=s96-c",
    nickname: "Eeeva",
    role: "VIEWER",
  },
];

const apiReservations: Reservation[] = [
  {
    id: 4,
    title: "水族館",
    type: "ENTERTAINMENT",
    reservationTime: "2024-10-14T02:00:00.000Z",
    endTime: "2024-10-14T08:00:00.000Z",
    tripMemberId: 8,
    amount: 3,
    note: "- 魚魚不能吃\n- 不可以開閃光燈",
    description: `**探索深海的奇妙世界！** "在我們的水族館，您將踏上一段前所未有的海洋旅程，從五彩斑斕的熱帶魚到神秘的深海生物，讓每個角落都帶來驚喜！"`,
    updatedAt: "2024-10-13T09:05:17.000Z",
  },
  {
    id: 5,
    title: "超級無敵霹靂厲害的女僕咖啡廳",
    type: "HEALTH_BEAUTY",
    reservationTime: "2024-11-14T12:00:00.000Z",
    endTime: "2024-11-16T12:00:00.000Z",
    tripMemberId: 12,
    amount: 2,
    note: `1. **尊重女僕和其他客人**
   - 請尊重我們的女僕和其他顧客的隱私和感受。請勿進行任何不當言行或身體接觸，這是我們確保每位客人都有愉快體驗的基本規則。

2. **禁止拍攝或錄影**
   - 為了保護女僕們和其他客人的隱私，除非有特別許可，請勿拍攝或錄製女僕或其他人的照片和影片。如果您想與女僕合影，請提前詢問，並遵守店內規定。

3. **合影與遊戲互動**
   - 女僕咖啡廳的特色之一是與女僕們的互動體驗！我們提供合影和遊戲環節，但這些服務可能會收取額外費用，具體內容請參閱店內的說明。

4. **禮貌點單**
   - 請用禮貌的方式點單，女僕們會熱情地為您服務。我們鼓勵您使用店內的專屬問候語，如 "歡迎回家，主人！" 來增加體驗的樂趣。

5. **遵守店內規定**
   - 請配合店內的所有規定，包括消費方式、用餐時間等。我們會竭力提供最佳的服務，也希望客人能配合我們的運作。

6. **禮貌交流**
   - 女僕們的服務以有趣、輕鬆的互動為主，但請記住所有對話都應保持友善和尊重，避免涉及敏感或不適當的話題。

7. **消費與小費**
   - 女僕咖啡廳的消費會有固定套餐或加值服務，具體價格請參考菜單。若您對女僕的服務感到滿意，可以自由選擇是否提供小費作為鼓勵。

8. **禁止攜帶外食**
   - 為了確保店內食物的品質與衛生，請勿攜帶外食或飲品入內。店內提供多種精緻的餐飲選擇，期待您細細品味。

9. **服從工作人員指引**
   - 如果有任何問題或特殊要求，請隨時告知我們的工作人員。我們會根據情況提供協助並確保每位客人的安全和愉快。`,
    description:
      "歡迎來到我們的女僕咖啡廳！這裡不僅是品味美食與飲品的場所，更是沉浸於夢幻世界的最佳體驗。我們的女僕們將用貼心的服務，帶您進入一個充滿溫馨與趣味的特別世界，讓每一位客人都感受到賓至如歸的感覺。在這裡，我們希望您能放鬆心情，享受獨特的服務，讓您的每一刻都充滿驚喜與快樂！",
    updatedAt: "2024-10-13T13:09:05.000Z",
  },
];

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
