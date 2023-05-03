import { PackagePropertyGroup } from "../types"
import { PropertyPage } from "./PropertyPage"
import { PropertyString } from "./PropertyString"

/**
 * A Property Group is a list of values, separated from other property groups by a whitespace divider with an optional header
 */
export class PropertyGroup {
  private constructor(readonly data: PackagePropertyGroup) {}
  /**
   * Returns a new Property Group with the provided options
   * @param options
   * @returns
   */
  static of(options: {
    header: string | null
    values: (PropertyPage | PropertyString)[]
  }) {
    return new PropertyGroup({
      header: options.header,
      value: options.values.map((x) => x.data),
    })
  }
}
