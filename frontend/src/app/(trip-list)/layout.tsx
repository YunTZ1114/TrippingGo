"use client";

import { Avatar } from "antd";
import Image from "next/image";
import { redirect } from "next/navigation";
import { api } from "@/api";
import { logo } from "@/assets";
import { Input } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { useSearchParams } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import "./styles.css";

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

  if (userMe.error) redirect("/login");

  return (
    <div className="flex h-screen w-full flex-col bg-primary">
      <div className="flex w-full items-center gap-4 px-10 py-2 text-white">
        <Image src={logo} sizes="24px" alt="logo" />
        <div className="flex-1">
          <Input
            value={searchParams.get("q") as string}
            onChange={(e) => setSearchParams({ q: e.target.value })}
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
        <Avatar
          className="cursor-pointer"
          src={userMe.data?.avatar ?? "/default-avatar.png"}
          size={32}
        />
      </div>
      <div className="mt-2 flex-1">
        <div className="mx-10 h-full rounded-t-2xl bg-surface p-10 shadow-paper">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
