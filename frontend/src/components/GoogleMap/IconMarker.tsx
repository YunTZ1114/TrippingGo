import { Marker } from "@react-google-maps/api";
import { ComponentProps, useMemo } from "react";

type MarkerProps = ComponentProps<typeof Marker>;
interface IconMarkerProps extends MarkerProps {
  color?: string;
  strokeColor?: string;
  size?: number;
  icon: string;
}

export const IconMarker = ({
  color = "#669de1",
  strokeColor = "#ffffff",
  icon,
  size = 14,
  ...props
}: IconMarkerProps) => {
  const placeMarker = useMemo(
    () => ({
      path: google.maps.SymbolPath.CIRCLE,
      strokeColor: strokeColor,
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: size * 0.15,
      scale: size * 0.8,
    }),
    [color, size],
  );

  return (
    <Marker
      icon={placeMarker}
      label={{
        text: icon,
        className: "material-symbols-rounded place-marker-icon",
        color: "white",
        fontSize: `${size}px`,
      }}
      {...props}
    />
  );
};
