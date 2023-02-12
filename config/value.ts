import { BuilderExtract, IBuilder } from "./builder.ts";
import { Config } from "./config.ts";
import { List } from "./list.ts";
import { Pointer } from "./pointer.ts";

export type Description = {
  name: string;
  description: string | null;
  warning: string | null;
};
export type Default<A> = {
  default: A;
};
export type NullableDefault<A> = {
  default: A | null;
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
  | null
  | string
  | {
      any: string;
    };

export class Value<A> extends IBuilder<A> {
  static boolean<A extends Description & Default<boolean>>(a: A) {
    return new Value({
      type: "boolean" as const,
      ...a,
    });
  }
  static string<A extends Description & NullableDefault<string> & Nullable & StringSpec>(a: A) {
    return new Value({
      type: "string" as const,
      ...a,
    });
  }
  static number<A extends Description & NullableDefault<number> & Nullable & NumberSpec>(a: A) {
    return new Value({
      type: "number" as const,
      ...a,
    });
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
      NullableDefault<Config<B>> & { values: readonly string[] | string[]; "value-names": Record<string, string> },
    B
  >(a: A) {
    const { default: previousDefault, ...rest } = a;
    if (previousDefault == null) {
      return new Value({
        type: "object" as const,
        ...rest,
      });
    }
    return new Value({
      type: "object" as const,
      ...rest,
      default: previousDefault.build(),
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
      [key: string]: Config<unknown>;
    }
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

  static pointer<A>(a: Pointer<A>) {
    return new Value(a.build());
  }
  static list<A extends List<B>, B>(a: A) {
    return new Value({
      type: "list" as const,
      ...a.build(),
    });
  }
}
