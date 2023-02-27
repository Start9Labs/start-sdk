// deno-lint-ignore-file ban-types
import { IParser, OnParse } from "./interfaces.js";
import { isFunctionTest } from "./utils.js";

export class FunctionParser implements IParser<unknown, Function> {
  constructor(
    readonly description = {
      name: "Function",
      children: [],
      extras: [],
    } as const,
  ) {}
  parse<C, D>(a: unknown, onParse: OnParse<unknown, Function, C, D>): C | D {
    if (isFunctionTest(a)) return onParse.parsed(a);

    return onParse.invalid({
      value: a,
      keys: [],
      parser: this,
    });
  }
}
