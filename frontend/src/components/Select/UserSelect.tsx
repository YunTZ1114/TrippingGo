"use client";

import { api } from "@/api";
import { User } from "@/api/users";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "antd";
import { useMemo, useState } from "react";
import { Select, SelectProps } from "./Select";

export const UserLabel = ({
  name,
  avatar,
  email,
}: {
  name: string;
  avatar?: string;
  email?: string;
}) => (
  <div className="flex gap-2">
    <Avatar size={36} icon={name[0].toUpperCase()} src={avatar} />
    <div>
      <div>{name}</div>
      <div className="text-body-small">{email}</div>
    </div>
  </div>
);

export const UserTag = ({
  name,
  avatar,
  onClose,
}: User & { onClose: () => void }) => (
  <div
    className="my-1 mr-1 flex items-center gap-2 rounded-full bg-gray-200 p-1"
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
      className="flex cursor-pointer rounded-full p-[2px] transition-all hover:bg-gray-400/50"
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
