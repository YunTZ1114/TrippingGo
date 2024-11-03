import { Polyline as GooglePolyline } from "@react-google-maps/api";
import { ComponentProps, useEffect, useState } from "react";

type GooglePolylineProps = ComponentProps<typeof GooglePolyline>;

interface BasePolylineProps extends GooglePolylineProps {
  color?: string;
}

const BasePolyline = ({ color, ...props }: BasePolylineProps) => {
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);
  // Cleanup effect
  useEffect(() => {
    return () => {
      if (polyline) polyline.setMap(null);
    };
  }, [polyline]);

  return (
    <GooglePolyline
      onLoad={setPolyline}
      onUnmount={() => setPolyline(null)}
      options={{
        strokeColor: color,
        strokeOpacity: 1,
        strokeWeight: 3,
      }}
      {...props}
    />
  );
};

const DottedPolyline = ({ color, ...props }: BasePolylineProps) => {
  return (
    <BasePolyline
      color={color}
      options={{
        strokeColor: color,
        strokeOpacity: 0,
        strokeWeight: 4,
        icons: [
          {
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              strokeOpacity: 1,
              strokeWeight: 3,
              fillColor: color,
              scale: 3,
            },
            offset: "0",
            repeat: "10px",
          },
        ],
      }}
      {...props}
    />
  );
};

interface PolylineProps extends BasePolylineProps {
  type?: "line" | "dotted";
}

export const Polyline = ({ type, ...props }: PolylineProps) => {
  switch (type) {
    case "dotted":
      return <DottedPolyline {...props} />;
    default:
      return <BasePolyline {...props} />;
  }
};
