import { ExpectedExports, PackagePropertiesV2 } from "../types";
import "../util/extensions";
import { Properties } from "./Properties";
export { Properties } from "./Properties";
export { PropertyObject } from "./PropertyObject";
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
  ) => Promise<Properties<PackagePropertiesV2>>
): ExpectedExports.properties {
  return (...args: Parameters<ExpectedExports.properties>) =>
    fn(...args).then((x) => x.build());
}
