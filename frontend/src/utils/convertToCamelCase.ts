import _ from "lodash";

export const convertKeysToCamelCase = <T extends Record<string, any>>(
  obj: T,
): T => {
  if (obj === null || typeof obj !== "object") return obj;

  return _.mapKeys(obj, (value, key) => _.camelCase(key)) as T;
};

export const recursiveConvertKeysToCamelCase = <T extends Record<string, any>>(
  obj: T,
): T => {
  if (obj === null || typeof obj !== "object") return obj;

  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null)
      obj[key as keyof T] = recursiveConvertKeysToCamelCase(value);
  });

  return _.mapKeys(obj, (value, key) => _.camelCase(key)) as T;
};
