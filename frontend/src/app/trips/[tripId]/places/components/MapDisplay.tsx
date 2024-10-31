import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import { PlaceInfo } from "../interface";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Place } from "@/api/trips";
import { renderToString } from "react-dom/server";

export const MapDisplay = ({
  location,
  focusPlaceId,
  center,
  placeInfo,
  places,
  onMarkerClick,
}: {
  location: google.maps.LatLngLiteral | null;
  center: google.maps.LatLngLiteral;
  placeInfo?: PlaceInfo | null;
  places?: Place[];
  onMarkerClick: (place: Place) => void;
  focusPlaceId?: number | "search";
}) => {
  const placeMarker = (color: string, isFocus: boolean) => ({
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    strokeWeight: isFocus ? 4 : 2,
    strokeColor: "#ffffff",
    scale: isFocus ? 18 : 10,
  });

  return (
    <div className="h-full w-full border-l-8 border-white">
      <GoogleMap
        center={location || center}
        zoom={14}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        // prettier-ignore
        options={{
          scaleControl: true,          // 開啟比例尺
          zoomControl: true,           // 開啟縮放按鈕
          scrollwheel: true,           // 開啟滾輪縮放
          //draggable: false,            // 禁止地圖拖動
          mapTypeControl: false,       // 關閉地圖類型控制
          streetViewControl: false,    // 關閉街景控制
          fullscreenControl: false,    // 關閉全屏按鈕
          rotateControl: false,        // 關閉旋轉控制
          keyboardShortcuts: false,    // 禁用鍵盤快捷鍵
          //gestureHandling: "none",     // 禁用手勢控制 none | cooperative | greedy | auto  
          mapTypeId: "roadmap",        // 設定為普通街道圖模式
          styles: [
            {  // 隱藏所有POI的標籤
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            },
          ],
          clickableIcons: false        //關閉可點擊的地標圖標
        }}
      >
        {places?.map((place, index) => {
          const isFocus = focusPlaceId === place.id;
          return (
            <Marker
              key={place.id}
              position={{ lat: +place.locationLat, lng: +place.locationLng }}
              title={place?.name} // 滑鼠hover時顯示
              zIndex={isFocus ? 999 : index}
              icon={placeMarker("#669de1", isFocus)}
              label={{
                text: ` ${place.icon}`,
                className: "material-symbols-rounded place-marker-icon",
                color: "white",
                fontSize: isFocus ? "28px" : "14px",
              }}
              onClick={() => {
                onMarkerClick(place);
              }}
            />
          );
        })}
        {focusPlaceId === "search" && location && (
          <Marker
            position={location}
            title={placeInfo?.name} // 滑鼠hover時顯示
            zIndex={1}
            label={{
              text: "search",
              className: "material-symbols-rounded place-marker-icon",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};
