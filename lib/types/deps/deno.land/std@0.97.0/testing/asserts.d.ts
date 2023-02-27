interface Constructor {
    new (...args: any[]): any;
}
export declare class AssertionError extends Error {
    constructor(message: string);
}
/**
 * Converts the input into a string. Objects, Sets and Maps are sorted so as to
 * make tests less flaky
 * @param v Value to be formatted
 */
export declare function _format(v: unknown): string;
/**
 * Deep equality comparison used in assertions
 * @param c actual value
 * @param d expected value
 */
export declare function equal(c: unknown, d: unknown): boolean;
/** Make an assertion, error will be thrown if `expr` does not have truthy value. */
export declare function assert(expr: unknown, msg?: string): asserts expr;
/**
 * Make an assertion that `actual` and `expected` are equal, deeply. If not
 * deeply equal, then throw.
 *
 * Type parameter can be specified to ensure values under comparison have the same type.
 * For example:
 *```ts
 *assertEquals<number>(1, 2)
 *```
 */
export declare function assertEquals(actual: unknown, expected: unknown, msg?: string): void;
export declare function assertEquals<T>(actual: T, expected: T, msg?: string): void;
/**
 * Make an assertion that `actual` and `expected` are not equal, deeply.
 * If not then throw.
 *
 * Type parameter can be specified to ensure values under comparison have the same type.
 * For example:
 *```ts
 *assertNotEquals<number>(1, 2)
 *```
 */
export declare function assertNotEquals(actual: unknown, expected: unknown, msg?: string): void;
export declare function assertNotEquals<T>(actual: T, expected: T, msg?: string): void;
/**
 * Make an assertion that `actual` and `expected` are strictly equal.  If
 * not then throw.
 * ```ts
 * assertStrictEquals(1, 2)
 * ```
 */
export declare function assertStrictEquals(actual: unknown, expected: unknown, msg?: string): void;
export declare function assertStrictEquals<T>(actual: T, expected: T, msg?: string): void;
/**
 * Make an assertion that `actual` and `expected` are not strictly equal.
 * If the values are strictly equal then throw.
 * ```ts
 * assertNotStrictEquals(1, 1)
 * ```
 */
export declare function assertNotStrictEquals(actual: unknown, expected: unknown, msg?: string): void;
export declare function assertNotStrictEquals<T>(actual: T, expected: T, msg?: string): void;
/**
 * Make an assertion that actual is not null or undefined. If not
 * then thrown.
 */
export declare function assertExists(actual: unknown, msg?: string): void;
/**
 * Make an assertion that actual includes expected. If not
 * then thrown.
 */
export declare function assertStringIncludes(actual: string, expected: string, msg?: string): void;
/**
 * Make an assertion that `actual` includes the `expected` values.
 * If not then an error will be thrown.
 *
 * Type parameter can be specified to ensure values under comparison have the same type.
 * For example:
 *```ts
 *assertArrayIncludes<number>([1, 2], [2])
 *```
 */
export declare function assertArrayIncludes(actual: ArrayLike<unknown>, expected: ArrayLike<unknown>, msg?: string): void;
export declare function assertArrayIncludes<T>(actual: ArrayLike<T>, expected: ArrayLike<T>, msg?: string): void;
/**
 * Make an assertion that `actual` match RegExp `expected`. If not
 * then thrown
 */
export declare function assertMatch(actual: string, expected: RegExp, msg?: string): void;
/**
 * Make an assertion that `actual` not match RegExp `expected`. If match
 * then thrown
 */
export declare function assertNotMatch(actual: string, expected: RegExp, msg?: string): void;
/**
 * Make an assertion that `actual` object is a subset of `expected` object, deeply.
 * If not, then throw.
 */
export declare function assertObjectMatch(actual: Record<PropertyKey, any>, expected: Record<PropertyKey, unknown>): void;
/**
 * Forcefully throws a failed assertion
 */
export declare function fail(msg?: string): void;
/**
 * Executes a function, expecting it to throw.  If it does not, then it
 * throws.  An error class and a string that should be included in the
 * error message can also be asserted.
 */
export declare function assertThrows<T = void>(fn: () => T, ErrorClass?: Constructor, msgIncludes?: string, msg?: string): Error;
/**
 * Executes a function which returns a promise, expecting it to throw or reject.
 * If it does not, then it throws.  An error class and a string that should be
 * included in the error message can also be asserted.
 */
export declare function assertThrowsAsync<T = void>(fn: () => Promise<T>, ErrorClass?: Constructor, msgIncludes?: string, msg?: string): Promise<Error>;
/** Use this to stub out methods that will throw when invoked. */
export declare function unimplemented(msg?: string): never;
/** Use this to assert unreachable code. */
export declare function unreachable(): never;
export {};
