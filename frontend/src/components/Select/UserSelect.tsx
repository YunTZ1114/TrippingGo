"use client";

import { api } from "@/api";
import { User } from "@/api/users";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "antd";
import { useMemo, useState } from "react";
import { Select, SelectProps } from "./Select";

const UserLabel = ({ name, avatar, email }: User) => (
  <div className="flex gap-2">
    <Avatar size={36} icon={name[0].toUpperCase()} src={avatar} />
    <div>
      <div>{name}</div>
      <div className="text-body-small">{email}</div>
    </div>
  </div>
);

const UserTag = ({ name, avatar, onClose }: User & { onClose: () => void }) => (
  <div
    className="flex bg-gray-200 gap-2 items-center p-1 rounded-full my-1 mr-1"
    onClick={(e) => e.stopPropagation()}
  >
    <Avatar
      className="bg-primary"
      size={24}
      icon={name[0].toUpperCase()}
      src={avatar}
    />
    {name}
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      className="rounded-full hover:bg-gray-400/50 transition-all p-[2px] cursor-pointer flex"
    >
      <MaterialSymbol icon="close" size={20} />
    </div>
  </div>
);

interface UserSelectProps extends SelectProps {
  expectUserId?: number[];
}

export const UserSelect = ({
  value = [],
  expectUserId = [],
  ...props
}: UserSelectProps) => {
  const [searchValue, setSearchValue] = useState("");

  const users = useQuery({
    queryFn: async () =>
      await api.users.get({
        params: {
          q: searchValue,
          limit: 5 + value.length + expectUserId.length,
        },
      }),
    queryKey: api.users.keys.get({ searchValue, value }),
  });

  const userOption = useMemo(() => {
    if (!users.data) return [];
    const valueSet = new Set([
      ...expectUserId,
      ...value.map((v: string) => JSON.parse(v).id),
    ]);
    const filterData = users.data.filter(({ id }) => !valueSet.has(id));
    return filterData.slice(0, 5).map((data) => ({
      value: JSON.stringify(data),
      label: <UserLabel {...data} />,
    }));
  }, [users.data, expectUserId]);

  return (
    <Select
      value={value}
      onBlur={() => setSearchValue("")}
      options={userOption}
      tagRender={({ value, onClose }) => {
        if (!value) return <div />;
        const data = JSON.parse(value);
        return <UserTag {...data} onClose={onClose} />;
      }}
      mode="multiple"
      loading={users.isLoading}
      onSearch={setSearchValue}
      size="large"
      variant="filled"
      {...props}
    />
  );
};
