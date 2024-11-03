import { MaterialSymbol } from "@/components/MaterialSymbol";
import { SavedPlaces } from "./SavedPlaces";
import { useState } from "react";
import { classNames } from "@/utils";

export const InfoBlock = () => {
  const [showContent, setShowContent] = useState(true);

  const title = "已儲存地點";

  return (
    <div
      className={classNames(
        "absolute right-4 top-4 flex flex-col rounded-lg bg-white p-2 shadow-lg",
        showContent && "bottom-4",
      )}
    >
      {/* title */}
      <div className="flex items-center justify-between gap-2 px-4 py-2 text-label-large font-bold">
        {title}
        <div
          onClick={() => setShowContent(!showContent)}
          className={classNames(
            "h-7 w-7 cursor-pointer rounded-full p-1 hover:bg-primary/10",
            !showContent && "rotate-180",
          )}
        >
          <MaterialSymbol
            size={20}
            icon="keyboard_double_arrow_up"
            className="text-primary"
          />
        </div>
      </div>

      {/* content */}
      {showContent && <SavedPlaces />}
    </div>
  );
};
