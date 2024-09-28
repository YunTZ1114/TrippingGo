import { MaterialSymbol } from "@/components/MaterialSymbol";

export const Loading = () => {
  return (
    <div className="h-full w-full flex-1 flex items-center justify-center">
      <MaterialSymbol
        icon="progress_activity"
        className="text-gray-200 animate-spin"
        size={72}
      />
    </div>
  );
};
