"use client";
import {
  Select as AntdSelect,
  type SelectProps as AntdSelectProps,
} from "antd";
import { useMemo, useState } from "react";
import { renderToString } from "react-dom/server";

const BaseSelect = (props: AntdSelectProps) => {
  return <AntdSelect {...props} />;
};

const SelectWithSearch = ({ options, ...props }: AntdSelectProps) => {
  const [searchValue, setSearchValue] = useState("");
  const currentOption = useMemo(() => {
    if (!options) return [];
    return options.filter(({ label }) => {
      return renderToString(label)
        .toLocaleLowerCase()
        .includes(searchValue.toLocaleLowerCase());
    });
  }, [options, searchValue]);

  return (
    <AntdSelect
      options={currentOption}
      showSearch
      filterOption={false}
      onSearch={setSearchValue}
      {...props}
    />
  );
};

export interface SelectProps extends AntdSelectProps {}

export const Select = ({ showSearch, ...props }: SelectProps) => {
  if (showSearch) return <SelectWithSearch {...props} />;
  return <BaseSelect {...props} />;
};
