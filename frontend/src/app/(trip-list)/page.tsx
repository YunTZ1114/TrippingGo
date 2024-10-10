"use client";

import { Button, Loading } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { theme } from "@/theme";
import { ConfigProvider, Modal, Tabs, TabsProps } from "antd";
import { NewTripModal } from "./modal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useSearchParams } from "@/hooks";
import { TripFilter } from "@/api/trips";
import Link from "next/link";

enum TripListType {
  RECOMMEND = "recommend",
  MINE = "mine",
  SAVED = "saved",
  RESULT = "result",
}

const tabItems: TabsProps["items"] = [
  { disabled: true, key: TripListType.RECOMMEND, label: "推薦行程" },
  { key: TripListType.MINE, label: "我的旅行" },
  { disabled: true, key: TripListType.SAVED, label: "已儲存" },
  { disabled: true, key: TripListType.RESULT, label: "搜尋結果" },
];

const Home = () => {
  const { searchParams } = useSearchParams();
  const [openModal, setOpenModal] = useState(false);
  const { data: trips, isLoading } = useQuery({
    queryKey: api.trips.keys.all(),
    queryFn: async () =>
      await api.trips.get({
        params: { q: searchParams.get("q") as string, filter: TripFilter.MINE },
      }),
  });

  return (
    <>
      <Tabs
        items={tabItems}
        tabBarExtraContent={
          <Button
            onClick={() => setOpenModal(true)}
            icon={<MaterialSymbol icon="edit_square" />}
            type="link"
          >
            新旅行！
          </Button>
        }
      />
      {(() => {
        if (isLoading) return <Loading colorClass="text-gray-400" />;
        return trips?.map(({ id, name, description }) => (
          <Link href={`/trips/${id}`} key={id}>
            <div className="bg-white rounded-lg p-4">
              <div className="text-label-large">{name}</div>
              <div className="text-body-medium text-gray-500 mt-2">
                {description}
              </div>
            </div>
          </Link>
        ));
      })()}
      <NewTripModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
};

export default Home;
