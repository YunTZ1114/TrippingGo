"use client";
import { useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { PlaceSearchBar } from "./components/PlaceSearchBar";
import { MapDisplay } from "./components/MapDisplay";
import { PageBlock } from "../components";
import { PlaceInfoCard } from "./components/PlaceInfoCard";

const libraries: "places"[] = ["places"];
const center = { lat: 25.038, lng: 121.5645 };
const apiRes = [
  {
    placeId: "ChIJQVW9eXLnAGARn-pUdRl0w4A",
    name: "難波八阪神社",
    duration: null,
    cost: "300",
    formattedAddress:
      "2 Chome-9-19 Motomachi, Naniwa Ward, Osaka, 556-0016日本",
    rating: 4.4,
    type: "戶外活動類",
    website: "https://nambayasaka.jp/",
    url: "https://maps.app.goo.gl/2mZ4y8sf8687vYxWA",
    weekdayText: [
      "星期一: 24 小時營業",
      "星期二: 24 小時營業",
      "星期三: 24 小時營業",
      "星期四: 24 小時營業",
      "星期五: 24 小時營業",
      "星期六: 24 小時營業",
      "星期日: 24 小時營業",
    ],
  },
  {
    placeId: "ChIJyR9MmRTnAGARez3ThyyaO9U",
    name: "道とん堀 大阪本店",
    formattedAddress: "1-chōme-6-20 Namba, Chuo Ward, Osaka, 542-0076日本",
    rating: 3.8,
    duration: 40,
    cost: null,
    type: null,
    website: "https://akr0355247354.owst.jp/",
    url: "https://maps.google.com/?cid=15365044069752585595",
    weekdayText: [
      "星期一: 12:00 - 23:00",
      "星期二: 12:00 - 23:00",
      "星期三: 12:00 - 23:00",
      "星期四: 12:00 - 23:00",
      "星期五: 12:00 - 23:00",
      "星期六: 12:00 - 23:00",
      "星期日: 12:00 - 23:00",
    ],
  },
  {
    placeId: "ChIJL45iOBDnAGARIY3U23yQT94",
    name: "元祖アイスドッグ",
    formattedAddress:
      "日本〒542-0086 Osaka, Chuo Ward, Nishishinsaibashi, 1-chōme-7-11 橋本ビル 1階",
    rating: 4.1,
    cost: "100",
    duration: 10,
    type: "餐廳",
    website: "",
    url: "https://maps.google.com/?cid=16019181265518628129",
    weekdayText: [
      "星期一: 11:00 – 21:00",
      "星期二: 11:00 – 21:00",
      "星期三: 11:00 – 21:00",
      "星期四: 11:00 – 21:00",
      "星期五: 11:00 – 21:00",
      "星期六: 11:00 – 21:00",
      "星期日: 11:00 – 21:00",
    ],
  },
  {
    placeId: "ChIJK2A0qGznAGARxPHcddHFYYA",
    name: "老爺爺蛋糕店",
    formattedAddress: "3-chōme-2-28 Namba, Chuo Ward, Osaka, 542-0076日本",
    rating: 4.3,
    duration: 20,
    cost: "450",
    type: "餐廳",
    website: "http://www.rikuro.co.jp/shoplist/134.html",
    url: "https://maps.google.com/?cid=9250892613011960260",
    weekdayText: [
      "星期一: 09:00 – 20:00",
      "星期二: 09:00 – 20:00",
      "星期三: 09:00 – 20:00",
      "星期四: 09:00 – 20:00",
      "星期五: 09:00 – 20:00",
      "星期六: 09:00 – 20:00",
      "星期日: 09:00 – 20:00",
    ],
  },
  {
    placeId: "ChIJSWA82NkDaDQR0PJbD8s014I",
    name: "小高拉麵",
    formattedAddress: "234台灣新北市永和區得和路413-1號",
    rating: 4.6,
    duration: 40,
    cost: null,
    type: "餐廳",
    website: "",
    url: "https://maps.google.com/?cid=9428062391664112336",
    weekdayText: [
      "星期一: 11:00 – 15:00, 17:00 – 23:30",
      "星期二: 11:00 – 15:00, 17:00 – 23:30",
      "星期三: 11:00 – 15:00, 17:00 – 23:30",
      "星期四: 11:00 – 15:00, 17:00 – 23:30",
      "星期五: 11:00 – 15:00, 17:00 – 23:30",
      "星期六: 11:00 – 15:00, 17:00 – 23:30",
      "星期日: 11:00 – 15:00, 17:00 – 23:30",
    ],
  },
];

const PlacePage = ({ params }: { params: { tripId: number } }) => {
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

  if (loadError) return <div>加載錯誤: {loadError.message}</div>;

  return (
    <div className="flex h-full">
      <PageBlock
        title="景點總覽"
        description="在這裡大家可以把需要標記、喜歡的地點放進來，如此一來就可以在行程規劃中做使用。"
        isLoading={!isLoaded}
        className="w-[600px]"
      >
        <div>
          <PlaceSearchBar onPlaceSelected={handlePlaceSelected} />
        </div>
        <div className="h-full flex-1 overflow-auto">
          {apiRes?.map((placeInfo) => (
            <PlaceInfoCard key={placeInfo.placeId} placeInfo={placeInfo} />
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
