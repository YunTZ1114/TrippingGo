"use client";

import { Skeleton } from "antd";
import { AxiosError } from "axios";
import { notFound, redirect } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { Loading } from "@/components";
import { SideBar } from "./components";
import { tripContext } from "./contexts";
import "./styles.css";

const Layout = ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: {
    tripId: string;
  };
}>) => {
  const { data, isLoading, error } = useQuery({
    queryKey: api.trips.keys.tripDetail(params.tripId),
    queryFn: () =>
      api.trips.getTripDetail({ pathParams: { tripId: +params.tripId } }),
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col bg-primary">
        <div className="mt-4 flex flex-1 gap-2">
          <div className="w-[300px] p-4">
            <Skeleton active paragraph={{ rows: 8 }} />
          </div>
          <div className="h-full flex-1 rounded-tl-3xl bg-surface shadow-paper">
            <Loading colorClass="text-gray-400" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    if (error instanceof AxiosError) {
      if (error.status === 401) redirect("/login");
      if (error.status === 404 || error.status === 403) notFound();
    }
    redirect("/");
  }

  return (
    <tripContext.Provider value={data}>
      <div className="flex h-screen w-full flex-col bg-primary">
        <div className="mt-4 flex flex-1 gap-2">
          <SideBar data={data} />
          <div className="h-full w-0 flex-1 overflow-hidden rounded-tl-3xl bg-surface shadow-paper">
            {isLoading ? <Loading /> : children}
          </div>
        </div>
      </div>
    </tripContext.Provider>
  );
};

export default Layout;
