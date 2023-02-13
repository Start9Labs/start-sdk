import { ConfigSpec, Tag, UniqueBy, ValueSpecList } from "../types.ts";
import { BuilderExtract, IBuilder } from "./builder.ts";
import { Config } from "./config.ts";
import { Default, NullableDefault, NumberSpec, StringSpec } from "./value.ts";
import { Description } from "./value.ts";
import * as T from "../types.ts";

export class List<A extends Tag<"list", ValueSpecList>> extends IBuilder<A> {
  // deno-lint-ignore ban-types
  static boolean<A extends Description & Default<boolean[]> & { range: string; spec: {} }>(a: A) {
    return new List({
      type: "list" as const,
      subtype: "boolean" as const,
      ...a,
    });
  }

  static string<A extends Description & Default<string[]> & { range: string; spec: StringSpec }>(a: A) {
    return new List({
      type: "list" as const,
      subtype: "string" as const,
      ...a,
    } as T.Tag<"list", T.Subtype<"string", T.WithDescription<T.WithDefault<T.ListSpec<T.ValueSpecString>, string[]>>>>);
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
    } as T.Tag<"list", T.Subtype<"object", T.WithDescription<T.WithNullableDefault<T.ListSpec<T.ValueSpecObject>, Record<string, unknown>[]>>>>);
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
    Variants extends { [key: string]: Config<ConfigSpec> },
    B extends ConfigSpec
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
      type: "list" as const,
      subtype: "union" as const,
      ...value,
    });
  }
}
