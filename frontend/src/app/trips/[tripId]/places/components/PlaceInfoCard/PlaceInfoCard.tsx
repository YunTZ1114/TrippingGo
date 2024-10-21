import { Collapse, CollapseProps } from "antd";
import { PlaceInfo } from "../../interface";
import { PlaceBaseInfo } from "./PlaceBaseInfo";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { PlaceDetail } from "./PlaceDetail";

const placeId = 1;

export const PlaceInfoCard = ({ placeInfo }: { placeInfo: PlaceInfo }) => {
  const items: CollapseProps["items"] = [
    {
      collapsible: "icon",
      key: "1",
      extra: (
        <div className="inline-flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-full bg-gray-200 text-gray-500 transition-colors duration-200 hover:bg-gray-300 hover:text-gray-700">
          <MaterialSymbol icon="delete" size={14} />
        </div>
      ),
      label: <PlaceBaseInfo placeInfo={placeInfo} />,
      children: (
        <PlaceDetail placeId={placeId} weekdayText={placeInfo.weekdayText} />
      ),
    },
  ];

  return (
    <Collapse
      className="group mb-2 bg-white"
      items={items}
      bordered={false}
      expandIcon={({ isActive }) => (
        <MaterialSymbol
          icon="arrow_forward_ios"
          size={16}
          className="transition-transform duration-300"
          style={{
            transform: isActive ? "rotate(90deg)" : "rotate(0deg)",
          }}
        />
      )}
    />
  );
};
