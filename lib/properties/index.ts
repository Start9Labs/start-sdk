import { ExpectedExports, Properties } from "../types";
import "../util/extensions";
import { PropertyGroup } from "./PropertyGroup";
import { PropertyString } from "./PropertyString";
export { PropertyGroup } from "./PropertyGroup";
export { PropertyString } from "./PropertyString";

export const test = "";

export type UnionToIntersection<T> = ((x: T) => any) extends (x: infer R) => any
  ? R
  : never;

/**
 * This is used during creating the type of properties fn in the service package.
 * This fn makes sure that the return type is correct and everything is infered to
 * reduce the types that the user has to make.
 * @param fn
 * @returns
 */
export function setupPropertiesExport(
  fn: (
    ...args: Parameters<ExpectedExports.properties>
  ) => void | Promise<void> | Promise<(PropertyGroup | PropertyString)[]>
): ExpectedExports.properties {
  return (async (...args) => {
    const result = await fn(...args);
    if (result) {
      const answer: Properties = result.map((x) => x.data);
      return answer;
    }
  }) as ExpectedExports.properties;
}
