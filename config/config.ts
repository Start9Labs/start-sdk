import { ConfigSpec, ValueSpecAny } from "../types.ts";
import { BuilderExtract, IBuilder } from "./builder.ts";
import { Value } from "./value.ts";

export class Config<A extends ConfigSpec> extends IBuilder<A> {
  static empty() {
    return new Config({});
  }
  static withValue<K extends string, B extends ValueSpecAny>(key: K, value: Value<B>) {
    return new Config({
      [key]: value.build(),
    } as { [key in K]: B });
  }

  static of<B extends { [key: string]: Value<C> }, C extends ValueSpecAny>(spec: B) {
    // deno-lint-ignore no-explicit-any
    const answer: { [K in keyof B]: BuilderExtract<B[K]> } = {} as any;
    for (const key in spec) {
      // deno-lint-ignore no-explicit-any
      answer[key] = spec[key].build() as any;
    }
    return new Config(answer);
  }
  addValue<K extends string, B extends ValueSpecAny>(key: K, value: Value<B>) {
    return new Config({
      ...this.a,
      [key]: value.build(),
    } as A & { [key in K]: B });
  }
}
