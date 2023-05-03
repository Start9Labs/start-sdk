import { PackagePropertyPage } from "../types"
import { PropertyGroup } from "./PropertyGroup"

export class PropertyPage {
  private constructor(readonly data: PackagePropertyPage) {}
  static of(options: {
    name: string
    description: string | null
    groups: PropertyGroup[]
  }) {
    return new PropertyPage({
      type: "page",
      name: options.name,
      description: options.description,
      value: options.groups.map((x) => x.data),
    })
  }
}
