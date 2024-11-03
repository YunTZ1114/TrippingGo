import { baseKeys } from "./base";
import { memberKeys } from "./members";
import { reservationsKeys } from "./reservation";
import { checkListKeys } from "./checklist";
import { placeKeys } from "./place";
import { placeDurationKeys } from "./placeDuration";

export * from "./interfaces";
export * from "./base";
export * from "./members";
export * from "./reservation";
export * from "./checklist";
export * from "./place";
export * from "./placeDuration";

export const keys = {
  ...baseKeys,
  ...memberKeys,
  ...reservationsKeys,
  ...checkListKeys,
  ...placeKeys,
  ...placeDurationKeys,
};
