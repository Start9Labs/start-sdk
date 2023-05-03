import { PackagePropertyString } from "../types"

/**
 * A Property String is an arbitrary string value to display to the user
 */
export class PropertyString {
  private constructor(readonly data: PackagePropertyString) {}
  /**
   * Returns a new Property String with the provided options
   * @param value
   * @returns
   */
  static of(value: Omit<PackagePropertyString, "type">) {
    return new PropertyString({
      ...value,
      type: "string",
    })
  }
}
