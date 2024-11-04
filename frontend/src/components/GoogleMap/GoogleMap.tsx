import { GoogleMap as BaseGoogleMap, Marker } from "@react-google-maps/api";
import { ComponentProps } from "react";

type MapProps = ComponentProps<typeof BaseGoogleMap>;

export interface GoogleMapProps extends MapProps {
  location?: google.maps.LatLngLiteral | null;
  showSearch?: boolean;
}

export const GoogleMap = ({
  children,
  location,
  center,
  showSearch,
  ...props
}: GoogleMapProps) => {
  return (
    <BaseGoogleMap
      center={location || center}
      zoom={15}
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
            // 隱藏所有POI的標籤
            {  
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            },
          ],
          clickableIcons: false        //關閉可點擊的地標圖標
        }}
      {...props}
    >
      {children}

      {showSearch && location && (
        <Marker
          position={location}
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
    </BaseGoogleMap>
  );
};
