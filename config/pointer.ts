import { ValueSpec } from "../types/config-types.ts";
import { IBuilder } from "./builder.ts";
import { Description } from "./value.ts";

export class Pointer<A extends ValueSpec> extends IBuilder<A> {
  static packageTorKey<
    A extends Description & { "package-id": string; interface: string },
  >(a: A) {
    return new Pointer({
      type: "pointer" as const,
      subtype: "package" as const,
      target: "tor-key" as const,
      ...a,
    });
  }
  static packageTorAddress<
    A extends Description & { "package-id": string; interface: string },
  >(a: A) {
    return new Pointer({
      type: "pointer" as const,
      subtype: "package" as const,
      target: "tor-address" as const,
      ...a,
    });
  }
  static packageLanAddress<
    A extends Description & { "package-id": string; interface: string },
  >(a: A) {
    return new Pointer({
      type: "pointer" as const,
      subtype: "package" as const,
      target: "lan-address" as const,
      ...a,
    });
  }
  static packageConfig<
    A extends Description & {
      "package-id": string;
      selector: string;
      multi: boolean;
      interface: string;
    },
  >(a: A) {
    return new Pointer({
      type: "pointer" as const,
      subtype: "package" as const,
      target: "config" as const,
      ...a,
    });
  }
  static system<
    A extends Description & {
      "package-id": string;
      selector: string;
      multi: boolean;
      interface: string;
    },
  >(
    a: A,
  ) {
    return new Pointer({
      type: "pointer" as const,
      subtype: "system" as const,
      target: "system" as const,
      ...a,
    });
  }
}
