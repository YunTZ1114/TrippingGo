"use client";
import { api } from "@/api";
import { logo } from "@/assets";
import { Input } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "antd";
import Image from "next/image";

export const NavBar = () => {
  const userMe = useQuery({
    queryKey: api.users.keys.me(),
    queryFn: api.users.me,
  });

  return (
    <div className="flex w-full items-center gap-4 p-2 text-white">
      <Image src={logo} sizes="24px" alt="logo" />
      <div className="flex-1">
        <Input
          placeholder="搜尋旅行..."
          prefix={<MaterialSymbol icon="search" className="text-white" />}
          variant="filled"
          size="large"
          className="search-input rounded-full border-none bg-white/40"
        />
      </div>
      <MaterialSymbol icon="language" />
      <MaterialSymbol icon="light_mode" />
      <MaterialSymbol icon="notifications" />
      <Avatar src={userMe.data?.avatar ?? "/default-avatar.png"} size={32} />
    </div>
  );
};
