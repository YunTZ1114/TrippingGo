import { GoogleMap, Marker } from "@react-google-maps/api";

interface MapDisplayProps {
  location: google.maps.LatLngLiteral | null;
  center: google.maps.LatLngLiteral;
}

export const MapDisplay = ({ location, center }: MapDisplayProps) => {
  return (
    <div className="h-full w-full border-l-8 border-white">
      <GoogleMap
        center={location || center}
        zoom={15}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        // prettier-ignore
        options={{
          scaleControl: true,          // 開啟比例尺
          zoomControl: true,           // 開啟縮放按鈕
          scrollwheel: true,           // 開啟滾輪縮放
          draggable: false,            // 禁止地圖拖動
          mapTypeControl: false,       // 關閉地圖類型控制
          streetViewControl: false,    // 關閉街景控制
          fullscreenControl: false,    // 關閉全屏按鈕
          rotateControl: false,        // 關閉旋轉控制
          keyboardShortcuts: false,    // 禁用鍵盤快捷鍵
          gestureHandling: "none",     // 禁用手勢控制 none | cooperative | greedy | auto  
          mapTypeId: "roadmap",        // 設定為普通街道圖模式
        }}
      >
        {location && <Marker position={location} />}
      </GoogleMap>
    </div>
  );
};
