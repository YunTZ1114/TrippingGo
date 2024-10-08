import { MaterialSymbol } from "@/components/MaterialSymbol";
import { classNames } from "@/utils";

export const Loading = ({
  colorClass = "text-gray-200",
}: {
  colorClass?: string;
}) => {
  return (
    <div className="h-full w-full flex-1 flex items-center justify-center">
      <MaterialSymbol
        icon="progress_activity"
        className={classNames(colorClass, "animate-spin")}
        size={72}
      />
    </div>
  );
};
