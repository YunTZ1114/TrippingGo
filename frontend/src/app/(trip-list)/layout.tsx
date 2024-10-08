"use client";
import "./styles.css";
import { api } from "@/api";
import { logo } from "@/assets";
import { Input } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { useSearchParams } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "antd";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useCallback } from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { searchParams, setSearchParams } = useSearchParams();

  const userMe = useQuery({
    queryKey: api.users.keys.me(),
    queryFn: api.users.me,
  });

  if (userMe.error) {
    redirect("/login");
  }
  console.log(userMe.error);

  return (
    <div className="w-full flex flex-col h-screen bg-primary">
      <div className="w-full flex text-white items-center gap-4 py-2 px-10">
        <Image src={logo} sizes="24px" alt="logo" />
        <div className="flex-1">
          <Input
            value={searchParams.get("q") as string}
            onChange={(e) => setSearchParams({ q: e.target.value })}
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
        <Avatar
          className="cursor-pointer"
          src={userMe.data?.avatar ?? "/default-avatar.png"}
          size={32}
        />
      </div>
      <div className="flex-1 mt-2">
        <div className="p-10 h-full mx-10 rounded-t-2xl bg-surface shadow-paper">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
