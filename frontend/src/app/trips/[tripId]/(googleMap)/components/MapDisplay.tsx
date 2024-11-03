import { PlaceInfo } from "../interface";
import { Place } from "@/api/trips";
import {
  GoogleDirections,
  GoogleMap,
  GoogleMapProps,
  IconMarker,
} from "@/components/GoogleMap";

interface MapDisplayProps extends GoogleMapProps {
  className?: string;
  placeInfo?: PlaceInfo | null;
  places?: Place[];
  onMarkerClick: (place: Place) => void;
  focusPlaceId?: number | "search";
}

export const MapDisplay = ({
  focusPlaceId,
  places,
  onMarkerClick,
  ...props
}: MapDisplayProps) => {
  return (
    <GoogleMap showSearch={focusPlaceId === "search"} {...props}>
      {places?.map((place, index) => {
        const isFocus = focusPlaceId === place.id;
        return (
          <IconMarker
            key={place.id}
            position={{ lat: +place.locationLat, lng: +place.locationLng }}
            title={place?.name} // 滑鼠hover時顯示
            zIndex={isFocus ? 999 : index}
            size={isFocus ? 28 : 14}
            icon={place.icon ?? "flag"}
            onClick={() => onMarkerClick(place)}
          />
        );
      })}
      {places?.[0] && places[1] && (
        <GoogleDirections
          origin={places[0].googlePlaceId}
          destination={places[1].googlePlaceId}
          travelMode={google.maps.TravelMode.WALKING}
        />
      )}
    </GoogleMap>
  );
};
