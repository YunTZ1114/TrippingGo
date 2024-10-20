import { MaterialSymbol } from "@/components/MaterialSymbol";

export const FavoriteRate = ({
  iconSize = 20,
  rating,
}: {
  iconSize: number;
  rating?: number | null;
}) => {
  return (
    <div className="flex items-center text-primary">
      <div className="mr-1 flex items-center">
        <span className="relative flex items-center">
          <div
            style={{ height: (iconSize - 3) * ((rating ?? 0) / 5) + 1 }}
            className="absolute bottom-0 flex items-end overflow-hidden text-primary"
          >
            <MaterialSymbol icon="favorite" fill size={iconSize} />
          </div>
          <MaterialSymbol
            icon="favorite"
            fill
            className="text-gray-300"
            size={iconSize}
          />
        </span>
      </div>
      {rating ? (
        <div className="mr-1 text-[12px] leading-normal">{rating}</div>
      ) : (
        <div className="mr-1 text-[18px] font-bold leading-normal text-gray-300">
          -
        </div>
      )}
    </div>
  );
};
