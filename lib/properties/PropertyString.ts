import { PackagePropertyString } from "../types";

export class PropertyString<X extends PackagePropertyString> {
  private constructor(readonly data: X) {}
  static of(value: {
    description?: string;
    value: string;
    /** Let's the ui make this copyable button */
    copyable?: boolean;
    /** Let the ui create a qr for this field */
    qr?: boolean;
    /** Hiding the value unless toggled off for field */
    masked?: boolean;
  }) {
    return new PropertyString({
      ...value,
      type: "string",
    });
  }
}
