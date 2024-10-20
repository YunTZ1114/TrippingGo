import { MaterialSymbol } from "@/components/MaterialSymbol";
import { PlaceInfo } from "../../interface";
import { FavoriteRate } from "./FavoriteRate";
import { PlaceTags } from "./PlaceTags";

export const PlaceBaseInfo = ({ placeInfo }: { placeInfo: PlaceInfo }) => {
  return (
    <div className="-ml-6 rounded-md">
      <div className="ml-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-[16px] font-bold">{placeInfo.name}</div>
          <a
            href={placeInfo?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center"
          >
            <MaterialSymbol
              icon="open_in_new"
              size={14}
              text-blue-500
              className="text-blue-600"
            />
          </a>
        </div>
      </div>

      <div className="text-[12px] text-gray-400">
        {placeInfo.formattedAddress}
      </div>
      <div className="mt-2 flex items-center gap-2">
        {placeInfo.rating && (
          <FavoriteRate iconSize={20} rating={placeInfo.rating} />
        )}
        <PlaceTags
          duration={placeInfo.duration}
          type={placeInfo.type}
          cost={placeInfo.cost}
        />
      </div>
      <div className="text-[12px] text-gray-400"></div>
    </div>
  );
};
