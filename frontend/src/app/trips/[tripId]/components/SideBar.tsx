import { api } from "@/api";
import { TripDetail } from "@/api/trips";
import { logo } from "@/assets";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { useQuery } from "@tanstack/react-query";
import { Avatar, ConfigProvider, Divider, Menu } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";

const items = [
  {
    key: "settings",
    icon: <MaterialSymbol fill icon="settings" />,
    label: "設定",
  },
  {
    key: "members",
    icon: <MaterialSymbol fill icon="group" />,
    label: "成員",
  },
  {
    key: "timeline",
    icon: <MaterialSymbol fill icon="view_object_track" />,
    label: "行程安排",
    children: [
      {
        key: "places",
        icon: <MaterialSymbol fill icon="location_on" />,
        label: "景點選擇",
      },
      {
        icon: <MaterialSymbol fill icon="map" />,
        key: "map",
        label: "規劃行程",
      },
    ],
  },
  {
    key: "reservation",
    icon: <MaterialSymbol fill icon="event" />,
    label: "預約資訊",
  },
  {
    key: "preparation",
    icon: <MaterialSymbol fill icon="done_all" />,
    label: "行前準備",
  },
  {
    key: "shopping",
    icon: <MaterialSymbol fill icon="local_mall" />,
    label: "待買清單",
  },
  {
    key: "money",
    icon: <MaterialSymbol fill icon="paid" />,
    label: "分帳本",
    children: [
      {
        icon: <MaterialSymbol fill icon="receipt_long" />,
        key: "detail",
        label: "明細",
      },
      {
        icon: <MaterialSymbol fill icon="data_thresholding" />,
        key: "overview",
        label: "總覽",
      },
    ],
  },
];

export const SideBar = ({ data }: { data: TripDetail }) => {
  const userMe = useQuery({
    queryKey: api.users.keys.me(),
    queryFn: api.users.me,
  });
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const pathMatch = pathname.match(/\/trips\/\d+\/([^/]+)/);
  const activeKey = pathMatch ? [pathMatch[1]] : undefined;

  return (
    <div className="w-[260px] flex-shrink-0">
      <div className="mb-4 flex w-full items-center justify-between px-4 text-white">
        <Link href="/">
          <Image src={logo} sizes="12px" alt="logo" />
        </Link>
        <div className="flex gap-2">
          <MaterialSymbol icon="language" />
          <MaterialSymbol icon="light_mode" />
          <Avatar
            className="cursor-pointer"
            icon={userMe.data?.name[0].toUpperCase()}
            src={userMe.data?.avatar}
            size={28}
          />
        </div>
      </div>
      <div className="mb-4 pl-6 pr-2 text-title-large text-white">
        {data.trip.name}
      </div>
      <div className="mx-6">
        <Divider className="border-t-2 border-white/30" />
      </div>
      <ConfigProvider
        theme={{
          token: { colorPrimary: "#ffffff" },
          components: {
            Menu: {
              fontSize: 16,
              colorText: "#ffffff77",
              itemHoverColor: "#ffffffaa",
              itemSelectedBg: "transparent",
              colorBgContainer: "transparent",
              itemHoverBg: "transparent",
              itemActiveBg: "transparent",
              subMenuItemBg: "transparent",
            },
          },
        }}
      >
        <Menu
          selectedKeys={activeKey}
          onClick={({ key }) => router.push(`/trips/${params.tripId}/${key}`)}
          className="sidebar border-none"
          mode="inline"
          items={items}
        />
      </ConfigProvider>
    </div>
  );
};
