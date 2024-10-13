import {
  useRouter,
  useSearchParams as useNextSearchParams,
  usePathname,
} from "next/navigation";
import { useCallback } from "react";

export const useSearchParams = () => {
  const searchParams = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setSearchParams = useCallback(
    (newSearchParams: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newSearchParams).map(([key, value]) => {
        params.set(key, value);
      });
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams],
  );

  return { searchParams, setSearchParams };
};
