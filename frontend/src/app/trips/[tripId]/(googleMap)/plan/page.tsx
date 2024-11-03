"use client";
import { useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { MapDisplay } from "../components";
import { Timeline, InfoBlock } from "./components";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";

import "./styles.css";

const libraries: "places"[] = ["places"];
const center = { lat: 25.038, lng: 121.5645 };

const PlanPage = ({ params }: { params: { tripId: number } }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? "",
    libraries,
    // language: "zh-TW",
  });

  const [location, setLocation] = useState<google.maps.LatLngLiteral | null>(
    null,
  );
  const [address, setAddress] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<google.maps.LatLngLiteral | null>(null);

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
            alert("無法獲取地理位置，請確保您的瀏覽器允許此操作");
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
    address: string,
  ) => {
    setSelectedLocation(location);
    setAddress(address);
  };

  const { data: places } = useQuery({
    queryKey: api.trips.keys.place(+params.tripId),
    queryFn: () =>
      api.trips.getPlaces({ pathParams: { tripId: +params.tripId } }),
  });

  if (loadError) return <div>加載錯誤: {loadError.message}</div>;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative w-full flex-1">
        {isLoaded && (
          <MapDisplay
            location={selectedLocation ?? location}
            center={center}
            places={places}
          />
        )}

        <InfoBlock />
      </div>

      <Timeline />
      {/* <PageBlock
        title="景點總覽"
        description="在這裡大家可以把需要標記、喜歡的地點放進來，如此一來就可以在行程規劃中做使用。"
        isLoading={!isLoaded}
        className="w-[600px]"
      >
        <div>
          <PlaceSearchBar onPlaceSelected={handlePlaceSelected} />
        </div>
        <div className="h-full flex-1 overflow-auto"></div>
      </PageBlock> */}
    </div>
  );
};

export default PlanPage;
