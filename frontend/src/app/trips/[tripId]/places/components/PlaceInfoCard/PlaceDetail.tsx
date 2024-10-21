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
  placeId,
  weekdayText,
}: {
  placeId?: number;
  weekdayText?: string[];
}) => {
  const onChange = (key: string) => {
    console.log(key);
  };

  const handleWeekdayText = weekdayText?.map((item) => (
    <div key={item} className="mb-4">
      {item}
    </div>
  ));
  const tabItems: TabsProps["items"] = [
    {
      key: PlaceDetailType.HOURS,
      label: "營業時間",
      children: (
        <div className="ml-2 pt-2 text-[12px] font-bold">
          {handleWeekdayText}
        </div>
      ),
    },
    {
      key: PlaceDetailType.COMMENTS,
      label: "留言",
      children: <CommentList />,
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
