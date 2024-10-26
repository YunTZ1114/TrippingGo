import { Collapse, CollapseProps } from "antd";
import { PlaceInfo } from "../../interface";
import { PlaceBaseInfo } from "./PlaceBaseInfo";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { PlaceDetail } from "./PlaceDetail";
import { Place } from "@/api/trips";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

export const PlaceInfoCard = ({ place }: { place: Place }) => {
  const queryClient = useQueryClient();

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
      key: "1",
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
        <PlaceDetail placeId={place.id} weekdayText={place.weekdayText} />
      ),
    },
  ];

  return (
    <Collapse
      className="group mb-2 bg-white"
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
