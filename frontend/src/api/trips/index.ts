import { baseKeys } from "./base";
import { memberKeys } from "./members";
import { reservationsKeys } from "./reservation";

export * from "./base";
export * from "./members";
export * from "./reservation";

export const keys = {
  ...baseKeys,
  ...memberKeys,
  ...reservationsKeys,
};
