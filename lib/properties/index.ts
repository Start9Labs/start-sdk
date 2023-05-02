import { ExpectedExports, Properties } from "../types"

import { PropertyGroup } from "./PropertyGroup"
import { PropertyString } from "./PropertyString"
import "./PropertyGroup"
import "./PropertyString"

export type UnionToIntersection<T> = ((x: T) => any) extends (x: infer R) => any
  ? R
  : never

/**
 * This is used during creating the type of properties fn in the service package.
 * This fn makes sure that the return type is correct and everything is infered to
 * reduce the types that the user has to make.
 * @param fn
 * @returns
 */
export function setupProperties<WrapperData>(
  fn: (args: {
    wrapperData: WrapperData
  }) => void | Promise<void> | Promise<(PropertyGroup | PropertyString)[]>,
): ExpectedExports.properties {
  return (async (options) => {
    const result = await fn(
      options as {
        wrapperData: WrapperData & typeof options.wrapperData
      },
    )
    if (result) {
      const answer: Properties = result.map((x) => x.data)
      return answer
    }
  }) as ExpectedExports.properties
}
