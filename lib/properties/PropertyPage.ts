import { PackagePropertyPage } from "../types"
import { PropertyGroup } from "./PropertyGroup"

/**
 * A Property Page will display to the user as a button with a name a description.
 * Clicking the button will take the user to a nested page displaying the provided
 * list of Property Groups
 */
export class PropertyPage {
  private constructor(readonly data: PackagePropertyPage) {}
  /**
   * Returns a new Property Page with the provided options
   * @param options
   * @returns
   */
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
