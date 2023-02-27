"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeFromProps = exports.guardAll = exports.matchNumberWithRange = exports.generateDefault = void 0;
const dependencies_js_1 = require("../dependencies.js");
const isType = dependencies_js_1.matches.shape({ type: dependencies_js_1.matches.string });
const recordString = dependencies_js_1.matches.dictionary([dependencies_js_1.matches.string, dependencies_js_1.matches.unknown]);
const matchDefault = dependencies_js_1.matches.shape({ default: dependencies_js_1.matches.unknown });
const matchNullable = dependencies_js_1.matches.shape({ nullable: dependencies_js_1.matches.literal(true) });
const matchPattern = dependencies_js_1.matches.shape({ pattern: dependencies_js_1.matches.string });
const rangeRegex = /(\[|\()(\*|(\d|\.)+),(\*|(\d|\.)+)(\]|\))/;
const matchRange = dependencies_js_1.matches.shape({ range: dependencies_js_1.matches.regex(rangeRegex) });
const matchIntegral = dependencies_js_1.matches.shape({ integral: dependencies_js_1.matches.literal(true) });
const matchSpec = dependencies_js_1.matches.shape({ spec: recordString });
const matchSubType = dependencies_js_1.matches.shape({ subtype: dependencies_js_1.matches.string });
const matchUnion = dependencies_js_1.matches.shape({
    tag: dependencies_js_1.matches.shape({ id: dependencies_js_1.matches.string }),
    variants: recordString,
});
const matchValues = dependencies_js_1.matches.shape({
    values: dependencies_js_1.matches.arrayOf(dependencies_js_1.matches.string),
});
function charRange(value = "") {
    const split = value
        .split("-")
        .filter(Boolean)
        .map((x) => x.charCodeAt(0));
    if (split.length < 1)
        return null;
    if (split.length === 1)
        return [split[0], split[0]];
    return [split[0], split[1]];
}
/**
 * @param generate.charset Pattern like "a-z" or "a-z,1-5"
 * @param generate.len Length to make random variable
 * @param param1
 * @returns
 */
function generateDefault(generate, { random = () => Math.random() } = {}) {
    const validCharSets = generate.charset.split(",").map(charRange)
        .filter(Array.isArray);
    if (validCharSets.length === 0) {
        throw new Error("Expecing that we have a valid charset");
    }
    const max = validCharSets.reduce((acc, x) => x.reduce((x, y) => Math.max(x, y), acc), 0);
    let i = 0;
    const answer = Array(generate.len);
    while (i < generate.len) {
        const nextValue = Math.round(random() * max);
        const inRange = validCharSets.reduce((acc, [lower, upper]) => acc || (nextValue >= lower && nextValue <= upper), false);
        if (!inRange)
            continue;
        answer[i] = String.fromCharCode(nextValue);
        i++;
    }
    return answer.join("");
}
exports.generateDefault = generateDefault;
function withPattern(value) {
    if (matchPattern.test(value))
        return dependencies_js_1.matches.regex(RegExp(value.pattern));
    return dependencies_js_1.matches.string;
}
function matchNumberWithRange(range) {
    const matched = rangeRegex.exec(range);
    if (!matched)
        return dependencies_js_1.matches.number;
    const [, left, leftValue, , rightValue, , right] = matched;
    return dependencies_js_1.matches.number
        .validate(leftValue === "*"
        ? (_) => true
        : left === "["
            ? (x) => x >= Number(leftValue)
            : (x) => x > Number(leftValue), leftValue === "*"
        ? "any"
        : left === "["
            ? `greaterThanOrEqualTo${leftValue}`
            : `greaterThan${leftValue}`)
        .validate(rightValue === "*"
        ? (_) => true
        : right === "]"
            ? (x) => x <= Number(rightValue)
            : (x) => x < Number(rightValue), rightValue === "*"
        ? "any"
        : right === "]"
            ? `lessThanOrEqualTo${rightValue}`
            : `lessThan${rightValue}`);
}
exports.matchNumberWithRange = matchNumberWithRange;
function withIntegral(parser, value) {
    if (matchIntegral.test(value)) {
        return parser.validate(Number.isInteger, "isIntegral");
    }
    return parser;
}
function withRange(value) {
    if (matchRange.test(value)) {
        return matchNumberWithRange(value.range);
    }
    return dependencies_js_1.matches.number;
}
const isGenerator = dependencies_js_1.matches.shape({ charset: dependencies_js_1.matches.string, len: dependencies_js_1.matches.number }).test;
function defaultNullable(parser, value) {
    if (matchDefault.test(value)) {
        if (isGenerator(value.default)) {
            return parser.defaultTo(parser.unsafeCast(generateDefault(value.default)));
        }
        return parser.defaultTo(value.default);
    }
    if (matchNullable.test(value))
        return parser.optional();
    return parser;
}
/**
 * ConfigSpec: Tells the UI how to ask for information, verification, and will send the service a config in a shape via the spec.
 * ValueSpecAny: This is any of the values in a config spec.
 *
 * Use this when we want to convert a value spec any into a parser for what a config will look like
 * @param value
 * @returns
 */
function guardAll(value) {
    if (!isType.test(value)) {
        // deno-lint-ignore no-explicit-any
        return dependencies_js_1.matches.unknown;
    }
    switch (value.type) {
        case "boolean":
            // deno-lint-ignore no-explicit-any
            return defaultNullable(dependencies_js_1.matches.boolean, value);
        case "string":
            // deno-lint-ignore no-explicit-any
            return defaultNullable(withPattern(value), value);
        case "number":
            return defaultNullable(withIntegral(withRange(value), value), value);
        case "object":
            if (matchSpec.test(value)) {
                // deno-lint-ignore no-explicit-any
                return defaultNullable(typeFromProps(value.spec), value);
            }
            // deno-lint-ignore no-explicit-any
            return dependencies_js_1.matches.unknown;
        case "list": {
            const spec = (matchSpec.test(value) && value.spec) || {};
            const rangeValidate = (matchRange.test(value) && matchNumberWithRange(value.range).test) ||
                (() => true);
            const subtype = matchSubType.unsafeCast(value).subtype;
            return defaultNullable(dependencies_js_1.matches
                // deno-lint-ignore no-explicit-any
                .arrayOf(guardAll({ type: subtype, ...spec }))
                .validate((x) => rangeValidate(x.length), "valid length"), value);
        }
        case "enum":
            if (matchValues.test(value)) {
                return defaultNullable(dependencies_js_1.matches.literals(value.values[0], ...value.values), value);
            }
            // deno-lint-ignore no-explicit-any
            return dependencies_js_1.matches.unknown;
        case "union":
            if (matchUnion.test(value)) {
                return dependencies_js_1.matches.some(...Object.entries(value.variants).map(([variant, spec]) => dependencies_js_1.matches.shape({ [value.tag.id]: dependencies_js_1.matches.literal(variant) }).concat(typeFromProps(spec))));
            }
            // deno-lint-ignore no-explicit-any
            return dependencies_js_1.matches.unknown;
    }
    // deno-lint-ignore no-explicit-any
    return dependencies_js_1.matches.unknown;
}
exports.guardAll = guardAll;
/**
 * ConfigSpec: Tells the UI how to ask for information, verification, and will send the service a config in a shape via the spec.
 * ValueSpecAny: This is any of the values in a config spec.
 *
 * Use this when we want to convert a config spec into a parser for what a config will look like
 * @param valueDictionary
 * @returns
 */
function typeFromProps(valueDictionary) {
    // deno-lint-ignore no-explicit-any
    if (!recordString.test(valueDictionary))
        return dependencies_js_1.matches.unknown;
    return dependencies_js_1.matches.shape(Object.fromEntries(Object.entries(valueDictionary).map(([key, value]) => [key, guardAll(value)])));
}
exports.typeFromProps = typeFromProps;
