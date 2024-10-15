import { MaterialSymbol } from "@/components/MaterialSymbol";
import { classNames } from "@/utils";
import { ReactNode, useEffect, useRef, useState } from "react";

interface CardProps {
  isPublic?: boolean;
  className?: string;
  children: ReactNode;
}

export const Card = ({ className, isPublic, children }: CardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const setColumnHeight = () => {
      if (!ref.current) return;
      const { height } = ref.current.getBoundingClientRect();
      setRows(Math.ceil(height / 32) + 1);
    };
    if (rows !== 0) {
      setColumnHeight();
    }
    const timer = setTimeout(() => {
      setColumnHeight();
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  }, [children, rows]);

  return (
    <div
      style={{ gridRowEnd: `span ${rows}` }}
      className={classNames(
        "relative rounded-lg transition-all",
        rows === 0 && "opacity-0",
        isPublic
          ? "bg-white"
          : "border-2 border-dashed border-white bg-white/50",
        className,
      )}
    >
      <div className="absolute bottom-1 right-2 text-white">
        <MaterialSymbol icon="lock" fill size={24} />
      </div>
      <div ref={ref}>{children}</div>
    </div>
  );
};
