import { ConfigSpec, Tag, ValueSpecAny, ValueSpecList } from "../types.ts";
import * as T from "../types.ts";
import { BuilderExtract, IBuilder } from "./builder.ts";
import { Config } from "./config.ts";
import { List } from "./list.ts";
import { Pointer } from "./pointer.ts";

export type DefaultString =
  | string
  | {
      charset: string | null | undefined;
      len: number;
    };
export type Description = {
  name: string;
  description: string | null;
  warning: string | null;
};
export type Default<A> = {
  default: A;
};
export type NullableDefault<A> = {
  default?: A;
};

export type StringSpec = {
  copyable: boolean | null;
  masked: boolean | null;
  placeholder: string | null;
} & (
  | {
      pattern: string;
      "pattern-description": string;
    }
  // deno-lint-ignore ban-types
  | {}
);
export type NumberSpec = {
  range: string | null;
  integral: boolean | null;
  units: string | null;
  placeholder: number | null;
};
export type Nullable = {
  nullable: boolean;
};

type _UniqueBy =
  | string
  | {
      any: _UniqueBy[];
    };

export class Value<A extends ValueSpecAny> extends IBuilder<A> {
  static boolean<A extends Description & Default<boolean>>(a: A) {
    return new Value({
      type: "boolean" as const,
      ...a,
    });
  }
  static string<A extends Description & NullableDefault<DefaultString> & Nullable & StringSpec>(a: A) {
    return new Value({
      type: "string" as const,
      ...a,
    } as Tag<"string", T.WithDescription<T.WithNullableDefault<T.WithNullable<T.ValueSpecString>, DefaultString>>>);
  }
  static number<A extends Description & NullableDefault<number> & Nullable & NumberSpec>(a: A) {
    return new Value({
      type: "number" as const,
      ...a,
    } as Tag<"number", T.WithDescription<T.WithNullableDefault<T.WithNullable<T.ValueSpecNumber>, number>>>);
  }
  static enum<
    A extends Description &
      Default<string> & { values: readonly string[] | string[]; "value-names": Record<string, string> }
  >(a: A) {
    return new Value({
      type: "enum" as const,
      ...a,
    });
  }
  static object<
    A extends Description &
      NullableDefault<{ [k: string]: unknown }> & {
        "display-as": null | string;
        "unique-by": null | string;
        spec: Config<B>;
        "value-names": Record<string, string>;
      },
    B extends ConfigSpec
  >(a: A) {
    const { spec: previousSpec, ...rest } = a;
    const spec = previousSpec.build();
    return new Value({
      type: "object" as const,
      ...rest,
      spec,
    });
  }
  static union<
    A extends Description &
      Default<string> & {
        tag: {
          id: string;
          name: string | null;
          description: string | null;
          "variant-names": {
            [key: string]: string;
          };
        };
        variants: Variants;
        "display-as": string | null;
        "unique-by": _UniqueBy | null;
      },
    Variants extends {
      [key: string]: Config<B>;
    },
    B extends ConfigSpec
  >(a: A) {
    const { variants: previousVariants, ...rest } = a;
    // deno-lint-ignore no-explicit-any
    const variants: { [K in keyof Variants]: BuilderExtract<Variants[K]> } = {} as any;
    for (const key in previousVariants) {
      // deno-lint-ignore no-explicit-any
      variants[key] = previousVariants[key].build() as any;
    }
    return new Value({
      type: "union" as const,
      ...rest,
      variants,
    });
  }

  static pointer<A extends ValueSpecAny>(a: Pointer<A>) {
    return new Value(a.build());
  }
  static list<A extends List<B>, B extends Tag<"list", ValueSpecList>>(a: A) {
    return new Value(a.build());
  }
}
