import { baseKeys } from "./base";
import { memberKeys } from "./members";
import { reservationsKeys } from "./reservation";
import { checkListKeys } from "./checklist";
import { placeKeys } from "./place";

export * from "./interfaces";
export * from "./base";
export * from "./members";
export * from "./reservation";
export * from "./checklist";
export * from "./place";

export const keys = {
  ...baseKeys,
  ...memberKeys,
  ...reservationsKeys,
  ...checkListKeys,
  ...placeKeys,
};
