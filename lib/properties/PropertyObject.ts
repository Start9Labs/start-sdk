import { PackagePropertiesV2, PackagePropertyObject } from "../types";
import { Properties } from "./Properties";

export class PropertyObject<X extends PackagePropertyObject> {
  private constructor(readonly data: X) {}
  static of<X extends Properties<PackagePropertiesV2>>(
    description: string,
    value: X
  ) {
    return new PropertyObject({
      type: "object",
      description,
      value: value.data,
    });
  }
}
