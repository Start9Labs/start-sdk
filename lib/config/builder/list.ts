import { BuilderExtract, IBuilder } from "./builder";
import { Config } from "./config";
import { Default, NumberSpec, StringSpec } from "./value";
import { Description } from "./value";
import { Variants } from "./variants";
import {
  InputSpec,
  UniqueBy,
  ValueSpecList,
  ValueSpecListOf,
} from "../../types/config-types";

/**
 * Used as a subtype of Value.list
```ts

  export const authorizationList = List.string({
    "name": "Authorization",
    "range": "[0,*)",
    "spec": {
      "masked": null,
      "placeholder": null,
      "pattern": "^[a-zA-Z0-9_-]+:([0-9a-fA-F]{2})+\\$([0-9a-fA-F]{2})+$",
      "pattern-description":
        'Each item must be of the form "<USERNAME>:<SALT>$<HASH>".',
      "textarea": false,
    },
    "default": [],
    "description":
      "Username and hashed password for JSON-RPC connections. RPC clients connect using the usual http basic authentication.",
    "warning": null,
  });
```
 */
export class List<A extends ValueSpecList> extends IBuilder<A> {
  static string<
    A extends Description &
      Default<string[]> & {
        range: string;
        spec: StringSpec;
      },
  >(a: A) {
    return new List({
      type: "list" as const,
      subtype: "string" as const,
      ...a,
    } as ValueSpecListOf<"string">);
  }
  static number<
    A extends Description &
      Default<number[]> & {
        range: string;
        spec: NumberSpec;
      },
  >(a: A) {
    return new List({
      type: "list" as const,
      subtype: "number" as const,
      ...a,
    });
  }
  static enum<
    A extends Description &
      Default<string[]> & {
        range: string;
        spec: {
          values: string[];
          "value-names": {
            [key: string]: string;
          };
        };
      },
  >(a: A) {
    return new List({
      type: "list" as const,
      subtype: "enum" as const,
      ...a,
    });
  }
  static obj<
    A extends Description &
      Default<Record<string, unknown>[]> & {
        range: string;
        spec: {
          spec: Config<InputSpec>;
          "display-as": null | string;
          "unique-by": null | UniqueBy;
        };
      },
  >(a: A) {
    const { spec: previousSpec, ...rest } = a;
    const { spec: previousSpecSpec, ...restSpec } = previousSpec;
    const specSpec = previousSpecSpec.build() as BuilderExtract<
      A["spec"]["spec"]
    >;
    const spec = {
      ...restSpec,
      spec: specSpec,
    };
    const value = {
      spec,
      ...rest,
    };
    return new List({
      type: "list" as const,
      subtype: "object" as const,
      ...value,
    });
  }
  static union<
    A extends Description &
      Default<string[]> & {
        range: string;
        spec: {
          tag: {
            id: B;
            name: string;
            description: null | string;
            warning: null | string;
            "variant-names": {
              [key: string]: string;
            };
          };
          variants: Variants<{ [key: string]: InputSpec }>;
          "display-as": null | string;
          "unique-by": UniqueBy;
          default: string;
        };
      },
    B extends string,
  >(a: A) {
    const { spec: previousSpec, ...rest } = a;
    const { variants: previousVariants, ...restSpec } = previousSpec;
    const variants = previousVariants.build() as BuilderExtract<
      A["spec"]["variants"]
    >;
    const spec = {
      ...restSpec,
      variants,
    };
    const value = {
      spec,
      ...rest,
    };
    return new List({
      type: "list" as const,
      subtype: "union" as const,
      ...value,
    });
  }
}
