import { useState, useCallback } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { Input } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { PlaceInfo } from "../interface";

interface PlaceSearchBarProps {
  onPlaceSelected: (value: PlaceInfo) => void;
}

export const PlaceSearchBar = ({ onPlaceSelected }: PlaceSearchBarProps) => {
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

    const placeDetails: PlaceInfo = {
      placeId: place.place_id,
      locationLat: place.geometry.location.lat(),
      locationLng: place.geometry.location.lng(),
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      website: place.website,
      userRatingsTotal: place.user_ratings_total || 0,
      url: place.url,
      weekdayText: place.opening_hours?.weekday_text,
      reviews: place.reviews,
    };

    setSearchValue(place.name ?? "");
    onPlaceSelected(placeDetails);
  };

  return (
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
  );
};
