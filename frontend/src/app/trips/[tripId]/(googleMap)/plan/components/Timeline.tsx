import { api } from "@/api";
import { PlaceDuration } from "@/api/trips";
import { Loading } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { useSearchParams } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { DatePicker, Divider } from "antd";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useTripContext } from "../../../contexts";
import { classNames } from "@/utils";

const Placeholder = () => {
  return (
    <div className="flex px-[10px]">
      {new Array(143).fill("").map((_, i) => (
        <div
          key={i}
          className="relative flex h-[260px] w-5 flex-col items-center pt-5"
        >
          {i % 6 === 5 && (
            <div className="absolute top-0 shrink-0 text-xs text-gray-400">
              {i < 59 && "0"}
              {(i + 1) / 6}:00
            </div>
          )}
          <Divider
            className={
              i % 6 === 5 ? "h-full border-gray-300" : "h-full border-gray-100"
            }
            type="vertical"
          />
        </div>
      ))}
    </div>
  );
};

const GridItem = ({
  row,
  col,
  icon,
  children,
}: {
  row: number;
  col: number[];
  icon: string;
  children: string;
}) => {
  return (
    <div
      className="flex items-center justify-center gap-1 rounded-md bg-orange-300 p-1 text-white"
      style={{
        gridColumn: `${col[0] + 1} / span ${col[1] - col[0]}`,
        gridRow: row,
      }}
    >
      <MaterialSymbol icon={icon} size={16} />
      <div className="truncate">{children}</div>
    </div>
  );
};

export const Timeline = () => {
  const { searchParams, setSearchParams } = useSearchParams();

  const params = useParams();
  const { data: placeDurations, isLoading } = useQuery({
    queryKey: api.trips.keys.placeDuration(+params.tripId),
    queryFn: () =>
      api.trips.getPlaceDurations({ pathParams: { tripId: +params.tripId } }),
  });

  const mapPlaceWithDate = useMemo(() => {
    if (!placeDurations) return {};
    return placeDurations.reduce<Record<string, PlaceDuration[]>>(
      (prev, curr) => {
        const { date } = curr;
        return { ...prev, [date]: [...(prev[date] ?? []), curr] };
      },
      {},
    );
  }, [placeDurations]);

  const { trip } = useTripContext();

  const dateArray = useMemo(() => {
    const dates = [];
    let currentDate = dayjs(trip.startTime);
    const lastDate = dayjs(trip.endTime);

    while (currentDate.isBefore(lastDate) || currentDate.isSame(lastDate)) {
      dates.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "day");
    }

    return dates;
  }, []);

  const selectDate = searchParams.get("date");
  const selectDateIndex = selectDate && dateArray.indexOf(selectDate);
  const handleDateChange = (date: string) => {
    setSearchParams({ date });
  };

  useEffect(() => {
    if (selectDate && dateArray.includes(selectDate)) return;
    handleDateChange(dateArray[0]);
  }, [selectDate, dateArray]);

  return (
    <div className="w-full overflow-hidden bg-white">
      <div className="flex justify-between px-4 py-2">
        <div>行程時間軸</div>
        {selectDate && typeof selectDateIndex === "number" && (
          <div className="flex items-center gap-1">
            <div
              className={classNames(
                "h-7 w-7 cursor-pointer rounded-full p-1 hover:bg-primary/10",
                selectDateIndex === 0 && "pointer-events-none opacity-0",
              )}
              onClick={() => handleDateChange(dateArray[selectDateIndex - 1])}
            >
              <MaterialSymbol size={20} icon="keyboard_arrow_left" />
            </div>

            <DatePicker
              className="w-max border-none text-label-large font-bold"
              allowClear={false}
              suffixIcon={null}
              value={dayjs(selectDate)}
              onChange={(date) => handleDateChange(date.format("YYYY-MM-DD"))}
              disabledDate={(date) =>
                date.isBefore(dayjs(dateArray[0])) ||
                date.isAfter(dayjs(dateArray[dateArray.length - 1]))
              }
            />
            <div className="text-sm text-gray-500">
              第{dateArray.indexOf(selectDate) + 1}天
            </div>

            <div
              className={classNames(
                "h-7 w-7 cursor-pointer rounded-full p-1 hover:bg-primary/10",
                selectDateIndex === dateArray.length - 1 &&
                  "pointer-events-none opacity-0",
              )}
              onClick={() => handleDateChange(dateArray[selectDateIndex + 1])}
            >
              <MaterialSymbol size={20} icon="keyboard_arrow_right" />
            </div>
          </div>
        )}
      </div>
      {isLoading || !selectDate ? (
        <Loading />
      ) : (
        <div className="relative overflow-x-auto">
          <div className="timeline-grid ml-[1px]">
            {mapPlaceWithDate[selectDate]?.map(({ row, col }) => (
              <GridItem row={row} col={col} icon="flag">
                123
              </GridItem>
            ))}
          </div>
          <Placeholder />
        </div>
      )}
    </div>
  );
};
