import { Autocomplete } from "@react-google-maps/api";
import { useState, useCallback, useRef } from "react";
import { Input } from "@/components";
import { PlaceInfoCard } from "./PlaceInfoCard/PlaceInfoCard";
import { PlaceInfo } from "../interface";
import { MaterialSymbol } from "@/components/MaterialSymbol";

interface PlaceSearchBarProps {
  onPlaceSelected: (
    location: google.maps.LatLngLiteral,
    address: string,
  ) => void;
}

export const PlaceSearchBar = ({ onPlaceSelected }: PlaceSearchBarProps) => {
  const [placeInfo, setPlaceInfo] = useState<PlaceInfo | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const handleLoad = useCallback(
    (autocompleteInstance: google.maps.places.Autocomplete) => {
      setAutocomplete(autocompleteInstance);
    },
    [],
  );

  const handlePlaceChanged = () => {
    if (autocomplete === null) return;

    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) return;
    console.log("place: ", place);

    const placeDetails: PlaceInfo = {
      placeId: place.place_id,
      name: place.name,
      formattedAddress: place.formatted_address,
      rating: place.rating,
      website: place.website,
      userRatingsTotal: place.user_ratings_total || 0,
      url: place.url,
      weekdayText: place.opening_hours?.weekday_text,
    };

    setSearchValue(place.name ?? "");
    setPlaceInfo(placeDetails);

    onPlaceSelected(
      {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      },
      place.formatted_address || "",
    );
  };

  return (
    <div>
      <Autocomplete onLoad={handleLoad} onPlaceChanged={handlePlaceChanged}>
        <Input
          placeholder="搜尋..."
          prefix={<MaterialSymbol icon="search" />}
          variant="filled"
          size="large"
          className="w-full rounded-full border-none bg-white"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </Autocomplete>

      {placeInfo && <PlaceInfoCard placeInfo={placeInfo} />}
    </div>
  );
};
