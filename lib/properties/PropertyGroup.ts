import { PackagePropertyGroup } from "../types"
import { PropertyPage } from "./PropertyPage"
import { PropertyString } from "./PropertyString"

export class PropertyGroup {
  private constructor(readonly data: PackagePropertyGroup) {}
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
