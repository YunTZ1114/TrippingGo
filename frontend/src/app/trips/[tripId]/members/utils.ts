import { Member } from "@/api/trips";

const defaultKey = [
  "id",
  "userId",
  "nickname",
  "note",
  "isDeleted",
  "createdAt",
  "updatedAt",
  "userName",
  "avatar",
  "role",
];

export const getCustomKey = (data?: Member) => {
  return Object.keys(data ?? {}).filter((key) => !defaultKey.includes(key));
};
