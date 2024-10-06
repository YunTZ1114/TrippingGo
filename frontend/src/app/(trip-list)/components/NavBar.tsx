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
    <div className="w-full flex text-white items-center gap-4 p-2">
      <Image src={logo} sizes="24px" alt="logo" />
      <div className="flex-1">
        <Input
          placeholder="搜尋旅行..."
          prefix={<MaterialSymbol icon="search" className="text-white" />}
          variant="filled"
          size="large"
          className="bg-white/40 border-none rounded-full search-input"
        />
      </div>
      <MaterialSymbol icon="language" />
      <MaterialSymbol icon="light_mode" />
      <MaterialSymbol icon="notifications" />
      <Avatar src={userMe.data?.avatar ?? "/default-avatar.png"} size={32} />
    </div>
  );
};
