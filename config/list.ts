import { UniqueBy } from "../types.ts";
import { BuilderExtract, IBuilder } from "./builder.ts";
import { Config } from "./config.ts";
import { Default, NullableDefault, NumberSpec, StringSpec } from "./value.ts";
import { Description } from "./value.ts";

export class List<A> extends IBuilder<A> {
  // deno-lint-ignore ban-types
  static boolean<A extends Description & Default<boolean[]> & { range: string; spec: {} }>(a: A) {
    return new List({
      subtype: "boolean" as const,
      ...a,
    });
  }

  static string<
    A extends Description & Default<string[] & { range: string; spec: null | { range: string; spec: StringSpec } }>
  >(a: A) {
    return new List({
      subtype: "string" as const,
      ...a,
    });
  }
  static number<A extends Description & Default<number[]> & { range: string; spec: NumberSpec }>(a: A) {
    return new List({
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
      subtype: "enum" as const,
      ...a,
    });
  }
  static object<
    A extends Description &
      NullableDefault<Record<string, unknown>[]> & {
        range: string;
        spec: {
          spec: Config<B>;
          "display-as": null | string;
          "unique-by": null | UniqueBy;
        };
      },
    B
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
            id: string;
            name: null | string | undefined;
            description: null | string | undefined;
            "variant-names": {
              [key: string]: string;
            };
          };
          variants: Variants;
          "display-as": null | string | undefined;
          "unique-by": null | UniqueBy | undefined;
        };
      },
    Variants extends { [key: string]: Config<unknown> }
  >(a: A) {
    const { spec: previousSpec, ...rest } = a;
    const { variants: previousVariants, ...restSpec } = previousSpec;
    // deno-lint-ignore no-explicit-any
    const variants: { [K in keyof Variants]: BuilderExtract<Variants[K]> } = {} as any;
    for (const key in previousVariants) {
      // deno-lint-ignore no-explicit-any
      variants[key] = previousVariants[key].build() as any;
    }
    const spec = {
      ...restSpec,
      variants,
    };
    const value = {
      spec,
      ...rest,
    };
    return new List({
      subtype: "union" as const,
      ...value,
    });
  }
}
