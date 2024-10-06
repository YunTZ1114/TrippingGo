"use client";

import { Button } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { theme } from "@/theme";
import { ConfigProvider, Modal, Tabs, TabsProps } from "antd";
import { NewTripModal } from "./modal";
import { useState } from "react";

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
  const [openModal, setOpenModal] = useState(false);
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
      <NewTripModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
};

export default Home;
