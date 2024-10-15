import { BaseCheckListItem, CheckListType } from "@/api/trips";

export const newItemData = {
  title: "新列表",
  description: ["新項目"],
  isPublic: true,
  type: CheckListType.PREPARATION,
};

export const addPreparationListItems = (
  onClick: (value: BaseCheckListItem) => void,
) => [
  {
    onClick: () => onClick({ ...newItemData, isPublic: true }),
    label: "公用",
    key: "public",
  },
  {
    onClick: () => onClick({ ...newItemData, isPublic: false }),
    label: "私人",
    key: "private",
  },
];
