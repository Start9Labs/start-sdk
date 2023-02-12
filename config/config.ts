import { BuilderExtract, IBuilder } from "./builder.ts";
import { Value } from "./value.ts";

export class Config<A> extends IBuilder<A> {
  static empty() {
    return new Config({});
  }

  static of<B extends { [key: string]: Value<unknown> }>(spec: B) {
    // deno-lint-ignore no-explicit-any
    const answer: { [K in keyof B]: BuilderExtract<B[K]> } = {} as any;
    for (const key in spec) {
      // deno-lint-ignore no-explicit-any
      answer[key] = spec[key].build() as any;
    }
    return new Config(answer);
  }
  addValue<K extends string, B>(key: K, value: Value<B>) {
    return new Config({
      ...this.a,
      [key]: value.build(),
    } as A & { [key in K]: B });
  }
}
