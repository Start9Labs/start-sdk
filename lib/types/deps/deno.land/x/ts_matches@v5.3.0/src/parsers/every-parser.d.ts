import { Parser } from "./index.js";
import { AndParser, EnsureParser, IParser } from "./interfaces.js";
export type EveryParser<T> = T extends [] | readonly [] ? IParser<unknown, any> : T extends [infer A] | readonly [infer A] ? EnsureParser<A> : T extends [infer A, ...infer B] | readonly [infer A, ...infer B] ? AndParser<A, EveryParser<B>> : never;
/**
 * Intersection is a good tool to make sure that the validated value
 * is in the intersection of all the validators passed in. Basically an `and`
 * operator for validators
 */
export declare function every<RestParsers extends Parser<unknown, unknown>[]>(...parsers: RestParsers): EveryParser<RestParsers>;
