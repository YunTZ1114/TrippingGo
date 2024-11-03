import { PlaceInfo } from "../../interface";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { StarArray } from "./StarArray";
import { Avatar, Tabs, TabsProps } from "antd";
import { Button } from "@/components";
import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { BasePlace } from "@/api/trips";

enum PlaceDetailType {
  HOURS = "hours",
  COMMENTS = "comments",
}

const PlaceBaseInfo = ({
  tripId,
  placeInfo,
  onClose,
}: {
  tripId: number;
  placeInfo: PlaceInfo;
  onClose: () => void;
}) => {
  const apiData = useMemo(() => {
    return {
      locationLat: placeInfo.locationLat,
      locationLng: placeInfo.locationLng,
      name: placeInfo.name,
      weekdayText: placeInfo.weekdayText,
      googleMapUrl: placeInfo.url,
      googlePlaceId: placeInfo.placeId,
      address: placeInfo.address,
    } as BasePlace;
  }, [placeInfo]);

  const queryClient = useQueryClient();
  const postPlaceAction = useMutation({
    mutationFn: api.trips.postPlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: api.trips.keys.place(tripId) });
      onClose();
    },
  });

  return (
    <div className="rounded-md">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="text-[16px] font-bold">{placeInfo.name}</div>
          {placeInfo.website && (
            <a
              href={placeInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center"
            >
              <MaterialSymbol
                icon="language"
                size={16}
                className="text-blue-600"
              />
            </a>
          )}
          <a
            href={placeInfo?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer items-center"
          >
            <MaterialSymbol
              icon="open_in_new"
              size={16}
              className="text-blue-600"
            />
          </a>
        </div>
        <div className="flex gap-4">
          <Button
            type="primary"
            className="flex w-full items-center justify-center gap-2 rounded-full pt-0.5"
            size="small"
            onClick={() => {
              postPlaceAction.mutate({
                pathParams: { tripId },
                data: apiData,
              });
            }}
          >
            + 新增
          </Button>
          <div
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-gray-100 p-1 hover:bg-gray-200"
            onClick={onClose}
          >
            <MaterialSymbol icon="close" size={14} className="text-gray-400" />
          </div>
        </div>
      </div>

      <div className="text-[12px] text-gray-400">{placeInfo.address}</div>
      <div className="mt-2 flex items-center gap-2">
        {placeInfo.rating && (
          <StarArray iconSize={18} rating={placeInfo.rating} />
        )}
        <span className="text-[12px] leading-normal text-gray-400">
          ({placeInfo.userRatingsTotal})
        </span>
      </div>
      <div className="text-[12px] text-gray-400"></div>
    </div>
  );
};

const PlaceDetail = ({ placeInfo }: { placeInfo: PlaceInfo }) => {
  const tabItems: TabsProps["items"] = [
    {
      key: PlaceDetailType.HOURS,
      label: "營業時間",
      children: (
        <div className="space-y-2 rounded-lg p-4">
          <div className="space-y-2 text-sm">
            {placeInfo.weekdayText?.map((item: string) => {
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
      children: (
        <div className="space-y-2 rounded-lg bg-white pl-2 pr-2">
          {placeInfo.reviews?.map((item, i) => (
            <div key={item.author_name} className="group space-y-2">
              {!!i && <div className="border-t border-gray-100 pt-1" />}
              <div className="flex items-center space-x-3">
                <Avatar
                  className="border-2 border-gray-200 text-xs transition-transform group-hover:scale-105"
                  size={30}
                  icon={item.author_name?.toUpperCase()}
                  src={item.profile_photo_url}
                />
                <div>
                  <div className="text-gray-900">{item.author_name}</div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    {item.rating && (
                      <>
                        <div className="flex items-center">
                          <StarArray iconSize={14} rating={item.rating} />
                        </div>
                        <span>•</span>
                      </>
                    )}
                    <span>{item.relative_time_description}</span>
                  </div>
                </div>
              </div>

              <div className="pl-10">
                <p className="line-clamp-3 text-xs text-gray-600 hover:line-clamp-none">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return <Tabs centered={true} items={tabItems} />;
};

export const GooglePlaceInfoCard = ({
  tripId,
  placeInfo,
  onClose,
}: {
  tripId: number;
  placeInfo: PlaceInfo;
  onClose: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.scrollIntoView();
  }, [placeInfo]);

  return (
    <div ref={ref} className="mt-4 rounded-lg bg-white p-4">
      <PlaceBaseInfo tripId={tripId} placeInfo={placeInfo} onClose={onClose} />
      <PlaceDetail placeInfo={placeInfo} />
    </div>
  );
};
