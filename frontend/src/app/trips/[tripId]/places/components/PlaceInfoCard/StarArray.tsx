import { MaterialSymbol } from "@/components/MaterialSymbol";

export const StarArray = ({
  iconSize,
  rating,
}: {
  iconSize: number;
  rating: number;
}) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;
    if (starValue <= rating)
      return (
        <MaterialSymbol
          key={index}
          icon="star"
          fill
          className="text-[#F0BF38]"
          size={iconSize}
        />
      );

    if (starValue < rating + 1)
      return (
        <span key={index} className="relative flex items-center">
          <MaterialSymbol
            style={{ width: iconSize * (rating % 1) }}
            icon="star"
            fill
            className="absolute inset-0 overflow-hidden text-[#F0BF38]"
            size={iconSize}
          />
          <MaterialSymbol
            icon="star"
            fill
            className="text-gray-300"
            size={iconSize}
          />
        </span>
      );

    return (
      <MaterialSymbol
        key={index}
        icon="star"
        fill
        className="text-gray-300"
        size={iconSize}
      />
    );
  });

  return (
    <div className="flex items-center text-gray-400">
      <div className="text-[12px] leading-normal">{rating}</div>
      <div className="ml-1 flex items-center">{stars}</div>
    </div>
  );
};
