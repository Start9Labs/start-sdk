import { PackagePropertyString } from "../types"

export class PropertyString {
  private constructor(readonly data: PackagePropertyString) {}
  static of(value: Omit<PackagePropertyString, "type" | "watch">) {
    return new PropertyString({
      ...value,
      type: "string",
    })
  }
}
