import { useState } from "react";

export const useMountApi = () => {
  const [loading, setLoading] = useState(false);

  const mount = async <T,>(apiFunc: () => Promise<T>) => {
    setLoading(true);
    const [success, error] = await apiFunc()
      .then((res) => [res, null] as const)
      .catch((err) => [null, err] as const);
    setLoading(false);

    return [success, error] as const;
  };

  return { loading, mount };
};
