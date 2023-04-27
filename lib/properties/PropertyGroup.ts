import { PackagePropertyGroup } from "../types"
import { PropertyString } from "./PropertyString"

export class PropertyGroup {
  private constructor(readonly data: PackagePropertyGroup) {}
  static of(options: {
    description: string
    value: (PropertyGroup | PropertyString)[]
    name: string
  }) {
    return new PropertyGroup({
      type: "object",
      name: options.name,
      description: options.description,
      value: options.value.map((x) => x.data),
    })
  }
}
