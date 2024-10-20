import { MaterialSymbol } from "@/components/MaterialSymbol";

export const StarArray = ({ rating }: { rating: number }) => {
  const starSize = 14;
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;
    if (starValue <= rating)
      return (
        <MaterialSymbol
          icon="star"
          fill
          className="text-[#F0BF38]"
          size={starSize}
        />
      );

    if (starValue < rating + 1)
      return (
        <span className="relative flex items-center">
          <MaterialSymbol
            style={{ width: starSize * (rating % 1) }}
            icon="star"
            fill
            className="absolute inset-0 overflow-hidden text-[#F0BF38]"
            size={starSize}
          />
          <MaterialSymbol
            icon="star"
            fill
            className="text-gray-300"
            size={starSize}
          />
        </span>
      );

    return (
      <MaterialSymbol
        icon="star"
        fill
        className="text-gray-300"
        size={starSize}
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
