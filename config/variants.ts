import { ConfigSpec } from "../types/config-types.ts";
import { BuilderExtract, IBuilder } from "./builder.ts";
import { Config } from "./mod.ts";

export class Variants<A extends { [key: string]: ConfigSpec }> extends IBuilder<A> {
  static of<
    A extends {
      [key: string]: Config<ConfigSpec>;
    }
  >(a: A) {
    // deno-lint-ignore no-explicit-any
    const variants: { [K in keyof A]: BuilderExtract<A[K]> } = {} as any;
    for (const key in a) {
      // deno-lint-ignore no-explicit-any
      variants[key] = a[key].build() as any;
    }
    return new Variants(variants);
  }

  static empty() {
    return Variants.of({});
  }
  static withVariant<K extends string, B extends ConfigSpec>(key: K, value: Config<B>) {
    return Variants.empty().withVariant(key, value);
  }

  withVariant<K extends string, B extends ConfigSpec>(key: K, value: Config<B>) {
    return new Variants({
      ...this.a,
      [key]: value.build(),
    } as A & { [key in K]: B });
  }
}
