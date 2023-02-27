import { Parser } from "./index.js";
import { AnyParser } from "./any-parser.js";
import { ArrayParser } from "./array-parser.js";
import { BoolParser } from "./bool-parser.js";
import { FunctionParser } from "./function-parser.js";
import { NilParser } from "./nill-parser.js";
import { NumberParser } from "./number-parser.js";
import { ObjectParser } from "./object-parser.js";
import { StringParser } from "./string-parser.js";
import { UnknownParser } from "./unknown-parser.js";
/**
 * Create a custom type guard
 * @param test A function that will determine runtime if the value matches
 * @param testName A name for that function, useful when it fails
 */
export function guard(test, testName) {
    return Parser.isA(test, testName || test.name);
}
export const any = new Parser(new AnyParser());
export const unknown = new Parser(new UnknownParser());
export const number = new Parser(new NumberParser());
export const isNill = new Parser(new NilParser());
export const natural = number.refine((x) => x >= 0 && x === Math.floor(x));
export const isFunction = new Parser(new FunctionParser());
export const boolean = new Parser(new BoolParser());
export const object = new Parser(new ObjectParser());
export const isArray = new Parser(new ArrayParser());
export const string = new Parser(new StringParser());
export const instanceOf = (classCreator) => guard((x) => x instanceof classCreator, `is${classCreator.name}`);
export const regex = (tester) => string.refine(function (x) {
    return tester.test(x);
}, tester.toString());
