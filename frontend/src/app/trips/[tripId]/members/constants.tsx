import { Member, Role } from "@/api/trips";
import { Form, Input, Select } from "@/components";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { Avatar, TableColumnType, Tooltip } from "antd";

export const MAP_ROLE_TO_TEXT = {
  [Role.VIEWER]: "可觀看",
  [Role.EDITOR]: "可編輯",
  [Role.CREATOR]: "擁有者",
};

export const ROLE_OPTIONS = Object.entries(MAP_ROLE_TO_TEXT).map(
  ([key, value]) => ({
    label: value,
    value: key,
  })
);

export const TableColumns = (
  customKey: string[]
): TableColumnType<Member>[] => [
  {
    title: "成員",
    dataIndex: "userName",
    key: "userName",
    render: (_, { userName, nickname, avatar }) => (
      <div className="flex items-center">
        <Avatar src={avatar} className="mr-2" size={40} />
        <div>
          <div className="text-label-large">{userName}</div>
          <div className="text-body-small">{nickname}</div>
        </div>
      </div>
    ),
  },
  {
    title: "權限",
    dataIndex: "role",
    key: "role",
    render: (value) => MAP_ROLE_TO_TEXT[value as Role],
  },
  ...customKey.map((name) => ({
    title: name,
    dataIndex: name,
    key: name,
  })),
  {
    title: "備註",
    dataIndex: "note",
    key: "note",
  },
];

export const EditTableColumns = (
  customKey: string[],
  onDelete: (data: Member) => void
): TableColumnType<Member>[] => [
  {
    title: "成員",
    dataIndex: "userName",
    key: "userName",
    render: (_, { userName, avatar }, i) => (
      <div className="flex items-center">
        <Avatar src={avatar} className="mr-2 shrink-0" size={40} />
        <div>
          <div className="text-label-large">{userName}</div>
          <div className="flex text-nowrap">
            暱稱：
            <Form.Item noStyle name={[i, "nickname"]}>
              <Input size="small" />
            </Form.Item>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "權限",
    dataIndex: "role",
    key: "role",
    render: (value, _d, i) => (
      <Form.Item noStyle name={[i, "role"]}>
        <Select
          options={ROLE_OPTIONS.map((option) => ({
            ...option,
            className:
              option.value === Role.CREATOR ? "!max-h-0 !min-h-0 !p-0" : "",
          }))}
          disabled={value === Role.CREATOR}
        />
      </Form.Item>
    ),
  },
  ...customKey.map((name) => ({
    title: name,
    dataIndex: name,
    key: name,
    render: (_v: any, _d: any, i: number) => (
      <Form.Item noStyle name={[i, name]}>
        <Input />
      </Form.Item>
    ),
  })),
  {
    title: "備註",
    dataIndex: "note",
    key: "note",
    render: (_v, _d, i) => (
      <Form.Item noStyle name={[i, "note"]}>
        <Input />
      </Form.Item>
    ),
  },
  {
    key: "action",
    render: (_v, data, i) =>
      data.role === Role.CREATOR ? (
        <Tooltip title="不能移除擁有者">
          <MaterialSymbol className="text-black/20" icon="delete" />
        </Tooltip>
      ) : (
        <MaterialSymbol
          onClick={() => onDelete(data)}
          className="rounded-full text-red-500 hover:bg-red-500/20 cursor-pointer"
          icon="delete"
        />
      ),
  },
];
