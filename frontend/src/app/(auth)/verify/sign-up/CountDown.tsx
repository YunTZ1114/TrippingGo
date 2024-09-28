"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const CountDown = ({
  start,
  onFinish,
  end = 0,
  step = 1,
}: {
  start: number;
  onFinish?: () => void;
  end?: number;
  step?: number;
}) => {
  const router = useRouter();
  const [second, setSecond] = useState<number>(start);

  useEffect(() => {
    if (second === end) {
      router.push("/login");
      return;
    }
    setTimeout(() => {
      setSecond(second - step);
    }, 1000);
  }, [second]);

  return second;
};
