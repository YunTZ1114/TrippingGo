import { Tabs, TabsProps } from "antd";
import { CommentList } from "./CommentList";
import { Reservations } from "./Reservations";

enum PlaceDetailType {
  HOURS = "hours",
  COMMENTS = "comments",
  EXPENSES = "expenses",
  RESERVATIONS = "reservation",
}

export const PlaceDetail = ({
  tripId,
  placeId,
  weekdayText,
}: {
  tripId: number;
  placeId: number;
  weekdayText?: string[];
}) => {
  const onChange = (key: string) => {
    console.log(key);
  };

  const tabItems: TabsProps["items"] = [
    {
      key: PlaceDetailType.HOURS,
      label: "營業時間",
      children: (
        <div className="space-y-2 rounded-lg p-4">
          <div className="space-y-2 text-sm">
            {weekdayText?.map((item: string) => {
              const [day, hours] = item.split(": ");
              return (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-gray-100"
                >
                  <span className="font-medium text-gray-700">{day}</span>
                  <span className="text-gray-600">{hours}</span>
                </div>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      key: PlaceDetailType.COMMENTS,
      label: "留言",
      children: <CommentList tripId={tripId} placeId={placeId} />,
    },
    {
      key: PlaceDetailType.RESERVATIONS,
      label: "預約",
      children: <Reservations placeId={placeId} />,
    },
    { disabled: true, key: PlaceDetailType.EXPENSES, label: "帳本" },
  ];

  return <Tabs centered={true} items={tabItems} onChange={onChange} />;
};
