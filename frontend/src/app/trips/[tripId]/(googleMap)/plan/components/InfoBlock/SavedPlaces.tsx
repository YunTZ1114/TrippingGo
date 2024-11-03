import { Input } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { Divider } from "antd";
import { Fragment } from "react";
import { MarkerIconType, Place } from "@/api/trips";
import { FavoriteRate } from "../../../components/PlaceInfoCard/FavoriteRate";
import { PlaceTags } from "../../../components/PlaceInfoCard/PlaceTags";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";

export const PlaceInfoCard = ({ place }: { place: Place }) => {
  return (
    <div className="w-[400px] cursor-move rounded-md p-4 hover:bg-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-[16px] font-bold">{place.name}</div>
          <a
            href={place?.googleMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center"
          >
            <MaterialSymbol
              icon="open_in_new"
              size={14}
              className="text-blue-600"
            />
          </a>
        </div>
      </div>

      <div className="text-[12px] text-gray-400">{place.address}</div>
      <div className="mt-2 flex items-center gap-2">
        <FavoriteRate iconSize={20} rating={place.rating} />
        <PlaceTags
          tripId={place.tripId}
          placeId={place.id}
          duration={place.duration}
          cost={place.cost}
          icon={place.icon as MarkerIconType}
        />
      </div>
      <div className="text-[12px] text-gray-400"></div>
    </div>
  );
};

export const SavedPlaces = () => {
  const params = useParams();
  const { data: places } = useQuery({
    queryKey: api.trips.keys.place(+params.tripId),
    queryFn: () =>
      api.trips.getPlaces({ pathParams: { tripId: +params.tripId } }),
  });

  return (
    <>
      <Input
        placeholder="搜尋旅行..."
        prefix={<MaterialSymbol icon="search" />}
        variant="filled"
        size="large"
        className="m-2 w-auto rounded-full bg-surfaceLight"
      />
      <div className="flex flex-1 flex-col gap-2 overflow-auto">
        {places?.map((place, i) => (
          <Fragment key={place.id}>
            {!!i && <Divider className="m-0" />}
            <PlaceInfoCard
              // onOpenChange={(v) => handleCardOpenChange(v, place)}
              // key={place.id}
              place={place}
            />
          </Fragment>
        ))}
      </div>
    </>
  );
};
