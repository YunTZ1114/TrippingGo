import { DirectionsRenderer, DirectionsService } from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Polyline } from "./Polyline";

interface GoogleDirectionsProps extends google.maps.DirectionsRequest {
  origin: string;
  destination: string;
  departureTime?: Date;
}

export const GoogleDirections = ({
  origin,
  destination,
  travelMode,
  departureTime,
}: GoogleDirectionsProps) => {
  const [route, setRoutes] = useState<google.maps.DirectionsResult | null>();
  const options: google.maps.DirectionsRequest | null = useMemo(() => {
    return {
      origin: { placeId: origin },
      destination: { placeId: destination },
      travelMode,
      // drivingOptions: { departureTime: departureTime ?? new Date() },
    };
  }, [origin, destination, travelMode, departureTime]);

  const callback = useCallback(
    (result: google.maps.DirectionsResult | null) => {
      setRoutes(result);
    },
    [],
  );
  // console.log(
  //   route?.routes[0].overview_path.map(({ lat, lng }) => ({
  //     lat: lat(),
  //     lng: lng(),
  //   })),
  // );

  return (
    <>
      {options && <DirectionsService options={options} callback={callback} />}
      {route && <DirectionsRenderer directions={route} />}
    </>
  );
};
