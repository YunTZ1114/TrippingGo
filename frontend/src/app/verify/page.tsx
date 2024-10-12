"use client";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const VerifySignup = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const type = searchParams.get("type");
    if (!code || !type) return;
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center text-display-medium font-extrabold text-gray-500">
      <MaterialSymbol size={120} className="animate-spin" icon="sync" />
      驗證中
    </div>
  );
};

export default VerifySignup;
