import { Collapse, CollapseProps } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { api } from "@/api";
import { Place } from "@/api/trips";
import { PlaceBaseInfo } from "./PlaceBaseInfo";
import { PlaceDetail } from "./PlaceDetail";
import { useEffect, useRef, useState } from "react";

export const PlaceInfoCard = ({
  open,
  place,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  place: Place;
}) => {
  const queryClient = useQueryClient();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !open) return;
    ref.current.scrollIntoView();
  }, [open]);

  const deletePlaceAction = useMutation({
    mutationFn: api.trips.deletePlace,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: api.trips.keys.place(place.tripId),
      });
    },
  });
  const pathParams = { tripId: place.tripId, placeId: place.id };

  const items: CollapseProps["items"] = [
    {
      collapsible: "icon",
      key: "item_1",
      extra: (
        <div
          onClick={() => {
            deletePlaceAction.mutate({ pathParams });
          }}
          className="inline-flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-full bg-gray-200 text-gray-500 transition-colors duration-200 hover:bg-gray-300 hover:text-gray-700"
        >
          <MaterialSymbol icon="delete" size={14} />
        </div>
      ),
      label: <PlaceBaseInfo place={place} />,
      children: (
        <PlaceDetail
          tripId={place.tripId}
          placeId={place.id}
          weekdayText={place.weekdayText}
        />
      ),
    },
  ];

  return (
    <Collapse
      ref={ref}
      onChange={(v) => onOpenChange(v.includes("item_1"))}
      activeKey={open ? ["item_1"] : []}
      className="group bg-white"
      items={items}
      bordered={false}
      expandIcon={({ isActive }) => (
        <MaterialSymbol
          icon="arrow_forward_ios"
          size={16}
          className="transition-transform duration-300"
          style={{
            transform: isActive ? "rotate(90deg)" : "rotate(0deg)",
          }}
        />
      )}
    />
  );
};
