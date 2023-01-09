import { matches } from "../dependencies.ts";
import { ConfigSpec, ValueSpecAny } from "../types.ts";

type TypeBoolean = "boolean";
type TypeString = "string";
type TypeNumber = "number";
type TypeObject = "object";
type TypeList = "list";
type TypeEnum = "enum";
type TypePointer = "pointer";
type TypeUnion = "union";

// prettier-ignore
// deno-fmt-ignore
type GuardDefaultNullable<A, Type> = 
    A extends { readonly default: unknown} ? Type :
    A extends { readonly nullable: true} ? Type :
    A extends {readonly  nullable: false} ? Type | null | undefined :
    Type

// prettier-ignore
// deno-fmt-ignore
type GuardNumber<A> = 
    A extends {readonly type:TypeNumber} ? GuardDefaultNullable<A, number> :
    unknown
// prettier-ignore
// deno-fmt-ignore
type GuardString<A> = 
    A extends {readonly type:TypeString} ? GuardDefaultNullable<A, string> :
    unknown

// prettier-ignore
// deno-fmt-ignore
type GuardBoolean<A> = 
    A extends {readonly type:TypeBoolean} ? GuardDefaultNullable<A, boolean> :    
    unknown

// prettier-ignore
// deno-fmt-ignore
type GuardObject<A> = 
    A extends {readonly type: TypeObject, readonly spec: infer B} ? (
        B extends Record<string, unknown> ? {readonly [K in keyof B & string]: _<GuardAll<B[K]>>} :
        {_error: "Invalid Spec"}
    ) :
    unknown

// prettier-ignore
// deno-fmt-ignore
type GuardList<A> = 
    A extends {readonly type:TypeList, readonly subtype: infer B, spec?: {spec: infer C }} ? ReadonlyArray<GuardAll<Omit<A, "type" | "spec"> & ({type: B, spec: C})>> :
    unknown
// prettier-ignore
// deno-fmt-ignore
type GuardPointer<A> = 
    A extends {readonly type:TypePointer} ? {_UNKNOWN: "Pointer"} :
    unknown
// prettier-ignore
// deno-fmt-ignore
type GuardEnum<A> = 
    A extends {readonly type:TypeEnum, readonly values: ArrayLike<infer B>} ? GuardDefaultNullable<A, B> :
    unknown
// prettier-ignore
// deno-fmt-ignore
type GuardUnion<A> = 
    A extends {readonly type:TypeUnion, readonly tag: {id: infer Id & string}, variants: infer Variants & Record<string, unknown>} ? {[K in keyof Variants]: {[keyType in Id & string]: K}&TypeFromProps<Variants[K]>}[keyof Variants] :
    unknown

type _<T> = T;
export type GuardAll<A> = GuardNumber<A> &
  GuardString<A> &
  GuardBoolean<A> &
  GuardObject<A> &
  GuardList<A> &
  GuardPointer<A> &
  GuardUnion<A> &
  GuardEnum<A>;
// prettier-ignore
// deno-fmt-ignore
export type TypeFromProps<A> = 
 A extends Record<string, unknown> ? {readonly [K in keyof A & string]: _<GuardAll<A[K]>>} :
 unknown;

const isType = matches.shape({ type: matches.string });
const recordString = matches.dictionary([matches.string, matches.unknown]);
const matchDefault = matches.shape({ default: matches.unknown });
const matchNullable = matches.shape({ nullable: matches.literal(true) });
const matchPattern = matches.shape({ pattern: matches.string });
const rangeRegex = /(\[|\()(\*|(\d|\.)+),(\*|(\d|\.)+)(\]|\))/;
const matchRange = matches.shape({ range: matches.regex(rangeRegex) });
const matchIntegral = matches.shape({ integral: matches.literal(true) });
const matchSpec = matches.shape({ spec: recordString });
const matchSubType = matches.shape({ subtype: matches.string });
const matchUnion = matches.shape({
  tag: matches.shape({ id: matches.string }),
  variants: recordString,
});
const matchValues = matches.shape({
  values: matches.arrayOf(matches.string),
});

function charRange(value = "") {
  const split = value
    .split("-")
    .filter(Boolean)
    .map((x) => x.charCodeAt(0));
  if (split.length < 1) return null;
  if (split.length === 1) return [split[0], split[0]];
  return [split[0], split[1]];
}

/**
 *
 * @param generate.charset Pattern like "a-z" or "a-z,1-5"
 * @param generate.len Length to make random variable
 * @param param1
 * @returns
 */
export function generateDefault(generate: { charset: string; len: number }, { random = () => Math.random() } = {}) {
  const validCharSets: number[][] = generate.charset.split(",").map(charRange).filter(Array.isArray);
  if (validCharSets.length === 0) throw new Error("Expecing that we have a valid charset");
  const max = validCharSets.reduce((acc, x) => x.reduce((x, y) => Math.max(x, y), acc), 0);
  let i = 0;
  const answer: string[] = Array(generate.len);
  while (i < generate.len) {
    const nextValue = Math.round(random() * max);
    const inRange = validCharSets.reduce(
      (acc, [lower, upper]) => acc || (nextValue >= lower && nextValue <= upper),
      false
    );
    if (!inRange) continue;
    answer[i] = String.fromCharCode(nextValue);
    i++;
  }
  return answer.join("");
}

function withPattern<A>(value: unknown) {
  if (matchPattern.test(value)) return matches.regex(RegExp(value.pattern));
  return matches.string;
}
export function matchNumberWithRange(range: string) {
  const matched = rangeRegex.exec(range);
  if (!matched) return matches.number;
  const [, left, leftValue, , rightValue, , right] = matched;
  return matches.number
    .validate(
      leftValue === "*" ? (_) => true : left === "[" ? (x) => x >= Number(leftValue) : (x) => x > Number(leftValue),
      leftValue === "*" ? "any" : left === "[" ? `greaterThanOrEqualTo${leftValue}` : `greaterThan${leftValue}`
    )
    .validate(
      rightValue === "*" ? (_) => true : right === "]" ? (x) => x <= Number(rightValue) : (x) => x < Number(rightValue),
      rightValue === "*" ? "any" : right === "]" ? `lessThanOrEqualTo${rightValue}` : `lessThan${rightValue}`
    );
}
function withIntegral(parser: matches.Parser<unknown, number>, value: unknown) {
  if (matchIntegral.test(value)) {
    return parser.validate(Number.isInteger, "isIntegral");
  }
  return parser;
}
function withRange(value: unknown) {
  if (matchRange.test(value)) {
    return matchNumberWithRange(value.range);
  }
  return matches.number;
}
const isGenerator = matches.shape({ charset: matches.string, len: matches.number }).test;
function defaultNullable<A>(parser: matches.Parser<unknown, A>, value: unknown) {
  if (matchDefault.test(value)) {
    if (isGenerator(value.default)) return parser.defaultTo(parser.unsafeCast(generateDefault(value.default)));
    return parser.defaultTo(parser.unsafeCast(value.default));
  }
  if (matchNullable.test(value)) return parser.optional();
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
export function guardAll<A extends ValueSpecAny>(value: A): matches.Parser<unknown, GuardAll<A>> {
  if (!isType.test(value)) {
    // deno-lint-ignore no-explicit-any
    return matches.unknown as any;
  }
  switch (value.type) {
    case "boolean":
      // deno-lint-ignore no-explicit-any
      return defaultNullable(matches.boolean, value) as any;

    case "string":
      // deno-lint-ignore no-explicit-any
      return defaultNullable(withPattern(value), value) as any;

    case "number":
      return defaultNullable(
        withIntegral(withRange(value), value),
        value
        // deno-lint-ignore no-explicit-any
      ) as any;

    case "object":
      if (matchSpec.test(value)) {
        // deno-lint-ignore no-explicit-any
        return defaultNullable(typeFromProps(value.spec), value) as any;
      }
      // deno-lint-ignore no-explicit-any
      return matches.unknown as any;

    case "list": {
      const spec = (matchSpec.test(value) && value.spec) || {};
      const rangeValidate = (matchRange.test(value) && matchNumberWithRange(value.range).test) || (() => true);

      const subtype = matchSubType.unsafeCast(value).subtype;
      return defaultNullable(
        matches
          // deno-lint-ignore no-explicit-any
          .arrayOf(guardAll({ type: subtype, ...spec } as any))
          .validate((x) => rangeValidate(x.length), "valid length"),
        value
        // deno-lint-ignore no-explicit-any
      ) as any;
    }
    case "enum":
      if (matchValues.test(value)) {
        return defaultNullable(
          matches.literals(value.values[0], ...value.values),
          value
          // deno-lint-ignore no-explicit-any
        ) as any;
      }
      // deno-lint-ignore no-explicit-any
      return matches.unknown as any;
    case "pointer":
      // deno-lint-ignore no-explicit-any
      return matches.unknown as any;
    case "union":
      if (matchUnion.test(value)) {
        return matches.some(
          ...Object.entries(value.variants).map(([variant, spec]) =>
            matches.shape({ [value.tag.id]: matches.literal(variant) }).concat(typeFromProps(spec))
          ) // deno-lint-ignore no-explicit-any
        ) as any;
      }
      // deno-lint-ignore no-explicit-any
      return matches.unknown as any;
  }

  // deno-lint-ignore no-explicit-any
  return matches.unknown as any;
}
/**
 * ConfigSpec: Tells the UI how to ask for information, verification, and will send the service a config in a shape via the spec.
 * ValueSpecAny: This is any of the values in a config spec.
 *
 * Use this when we want to convert a config spec into a parser for what a config will look like
 * @param valueDictionary
 * @returns
 */
export function typeFromProps<A extends ConfigSpec>(valueDictionary: A): matches.Parser<unknown, TypeFromProps<A>> {
  // deno-lint-ignore no-explicit-any
  if (!recordString.test(valueDictionary)) return matches.unknown as any;
  return matches.shape(
    Object.fromEntries(Object.entries(valueDictionary).map(([key, value]) => [key, guardAll(value)]))
    // deno-lint-ignore no-explicit-any
  ) as any;
}
