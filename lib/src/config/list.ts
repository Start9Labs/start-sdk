import { BuilderExtract, IBuilder } from "./builder.js";
import { Config } from "./config.js";
import { Default, NumberSpec, StringSpec } from "./value.js";
import { Description } from "./value.js";
import { Variants } from "./variants.js";
import {
  ConfigSpec,
  UniqueBy,
  ValueSpecList,
  ValueSpecListOf,
} from "../types/config-types.js";

export class List<A extends ValueSpecList> extends IBuilder<A> {
  // // deno-lint-ignore ban-types
  // static boolean<A extends Description & Default<boolean[]> & { range: string; spec: {}; default: boolean }>(a: A) {
  //   return new List({
  //     type: "list" as const,
  //     subtype: "boolean" as const,
  //     ...a,
  //   });
  // }

  static string<
    A extends Description & Default<string[]> & {
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
    A extends Description & Default<number[]> & {
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
    A extends
      & Description
      & Default<string[]>
      & {
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
    A extends
      & Description
      & Default<Record<string, unknown>[]>
      & {
        range: string;
        spec: {
          spec: Config<ConfigSpec>;
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
    A extends
      & Description
      & Default<string[]>
      & {
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
          variants: Variants<{ [key: string]: ConfigSpec }>;
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
