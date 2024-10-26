"use client";
import { useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { PlaceSearchBar } from "./components/PlaceSearchBar";
import { MapDisplay } from "./components/MapDisplay";
import { PageBlock } from "../components";
import { PlaceInfoCard } from "./components/PlaceInfoCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";

const libraries: "places"[] = ["places"];
const center = { lat: 25.038, lng: 121.5645 };

const PlacePage = ({ params }: { params: { tripId: string } }) => {
  const [location, setLocation] = useState<google.maps.LatLngLiteral | null>(
    null,
  );
  // const [address, setAddress] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<google.maps.LatLngLiteral | null>(null);

  const { data: places } = useQuery({
    queryKey: api.trips.keys.place(+params.tripId),
    queryFn: () =>
      api.trips.getPlaces({ pathParams: { tripId: +params.tripId } }),
  });

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? "",
    libraries,
    language: "zh-TW",
  });

  useEffect(() => {
    if (!isLoaded) return;

    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error("Error fetching location:", error);
            alert(
              "We couldn't access your location. Please check if location services are enabled in your browser settings.",
            );
          },
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    };

    fetchLocation();
  }, [isLoaded]);

  const handlePlaceSelected = (
    location: google.maps.LatLngLiteral,
    //address: string,
  ) => {
    setSelectedLocation(location);
    //setAddress(address);
  };

  if (loadError) return <div>加載錯誤: {loadError.message}</div>;

  return (
    <div className="flex h-full">
      <PageBlock
        title="景點總覽"
        description="在這裡大家可以把需要標記、喜歡的地點放進來，如此一來就可以在行程規劃中做使用。"
        isLoading={!isLoaded}
        className="w-[600px] shrink-0"
      >
        <div>
          <PlaceSearchBar
            tripId={+params.tripId}
            onPlaceSelected={handlePlaceSelected}
          />
        </div>
        <div className="h-full flex-1 overflow-auto">
          {places?.map((place) => (
            <PlaceInfoCard key={place.id} place={place} />
          ))}
        </div>
      </PageBlock>

      {isLoaded && (
        <MapDisplay location={selectedLocation || location} center={center} />
      )}
    </div>
  );
};

export default PlacePage;
