"use client";

import { Button } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const VerifySignup = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const type = searchParams.get("type");
    if (!code || !type) return;
  }, [searchParams]);

  return (
    <>
      <div className="flex flex-col items-center text-gray-500 text-display-medium font-extrabold">
        <MaterialSymbol size={120} className="animate-spin" icon="sync" />
        驗證中
      </div>
    </>
  );
};

export default VerifySignup;
