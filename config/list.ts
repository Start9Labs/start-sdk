import { IBuilder } from "./builder.ts";
import { Config } from "./config.ts";
import { Default, NullableDefault, NumberSpec, StringSpec } from "./value.ts";
import { Description } from "./value.ts";
import * as T from "../types.ts";
import { Variants } from "./variants.ts";
import { ConfigSpec, UniqueBy, ValueSpecList, ValueSpecListOf } from "../types/config-types.ts";

export class List<A extends ValueSpecList> extends IBuilder<A> {
  // // deno-lint-ignore ban-types
  // static boolean<A extends Description & Default<boolean[]> & { range: string; spec: {}; default: boolean }>(a: A) {
  //   return new List({
  //     type: "list" as const,
  //     subtype: "boolean" as const,
  //     ...a,
  //   });
  // }

  static string<A extends Description & Default<string[]> & { range: string; spec: StringSpec }>(a: A) {
    return new List({
      type: "list" as const,
      subtype: "string" as const,
      ...a,
    } as ValueSpecListOf<"string">);
  }
  static number<A extends Description & Default<number[]> & { range: string; spec: NumberSpec }>(a: A) {
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
      }
  >(a: A) {
    return new List({
      type: "list" as const,
      subtype: "enum" as const,
      ...a,
    });
  }
  static objectV<
    A extends Description &
      NullableDefault<Record<string, unknown>[]> & {
        range: string;
        spec: {
          spec: Config<B>;
          "display-as": null | string;
          "unique-by": null | UniqueBy;
        };
      },
    B extends ConfigSpec
  >(a: A) {
    const { spec: previousSpec, ...rest } = a;
    const { spec: previousSpecSpec, ...restSpec } = previousSpec;
    const specSpec = previousSpecSpec.build();
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
    } as ValueSpecListOf<"object">);
  }
  static union<
    A extends Description &
      Default<string[]> & {
        range: string;
        spec: {
          tag: {
            id: string;
            name: string;
            description: null | string;
            "variant-names": {
              [key: string]: string;
            };
          };
          variants: Variants<B>;
          "display-as": null | string;
          "unique-by": UniqueBy;
          default: string;
        };
      },
    B extends { [key: string]: ConfigSpec }
  >(a: A) {
    const { spec: previousSpec, ...rest } = a;
    const { variants: previousVariants, ...restSpec } = previousSpec;
    const variants = previousVariants.build();
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
