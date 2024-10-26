import { MaterialSymbol } from "@/components/MaterialSymbol";
import { FavoriteRate } from "./FavoriteRate";
import { PlaceTags } from "./PlaceTags";
import { Place } from "@/api/trips";

export const PlaceBaseInfo = ({ place }: { place: Place }) => {
  return (
    <div className="-ml-6 rounded-md">
      <div className="ml-6 flex items-center justify-between">
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
        {place.rating && <FavoriteRate iconSize={20} rating={place.rating} />}
        <PlaceTags
          tripId={place.tripId}
          placeId={place.id}
          duration={place.duration}
          type={place.type}
          cost={place.cost}
        />
      </div>
      <div className="text-[12px] text-gray-400"></div>
    </div>
  );
};
