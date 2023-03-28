import * as matches from "ts-matches";
import { Parser } from "ts-matches";
import { InputSpec, unionSelectKey, ValueSpec as ValueSpecAny } from "../config/config-types";

const { string, some, object, dictionary, unknown, number, literals, boolean } = matches;

type TypeBoolean = "boolean";
type TypeString = "string";
type TypeNumber = "number";
type TypeObject = "object";
type TypeList = "list";
type TypeSelect = "select";
type TypeMultiselect = "multiselect";
type TypeUnion = "union";

// prettier-ignore
type GuardDefaultNullable<A, Type> =
  A extends {  default: unknown } ? Type :
  A extends {  nullable: true } ? Type :
  A extends {  nullable: false } ? Type | null | undefined :
  Type

// prettier-ignore
type GuardNumber<A> =
  A extends {  type: TypeNumber } ? GuardDefaultNullable<A, number> :
  unknown
// prettier-ignore
type GuardString<A> =
  A extends {  type: TypeString } ? GuardDefaultNullable<A, string> :
  unknown

// prettier-ignore
type GuardBoolean<A> =
  A extends {  type: TypeBoolean } ? GuardDefaultNullable<A, boolean> :
  unknown

// prettier-ignore
type GuardObject<A> =
  A extends {  type: TypeObject,  spec: infer B } ? (
    B extends Record<string, unknown> ? {  [K in keyof B & string]: _<GuardAll<B[K]>> } :
    { _error: "Invalid Spec" }
  ) :
  unknown
// prettier-ignore
export type GuardList<A> =
  A extends {  type: TypeList,  subtype: infer B, spec?: { spec?: infer C } } ? Array<GuardAll<Omit<A, "type" | "subtype" | "spec"> & ({ type: B, spec: C })>> :
  A extends {  type: TypeList,  subtype: infer B, spec?: {} } ? Array<GuardAll<Omit<A, "type"> & ({ type: B })>> :
  unknown
// prettier-ignore
type GuardSelect<A> =
  A extends {  type: TypeSelect, values: infer B } ? (
    B extends Record<string, string> ? keyof B : never
  ) :
  unknown

// prettier-ignore
type GuardMultiselect<A> =
    A extends {  type: TypeMultiselect, variants: { [key in infer B & string]: string } } ?B[] :
unknown

// prettier-ignore
type VariantValue<A> =
  A extends { name: string, spec: infer B } ?  TypeFromProps<B>  :
  never
// prettier-ignore
type GuardUnion<A> =
  A extends {  type: TypeUnion, variants: infer Variants & Record<string, unknown> } ?
  { [key in keyof Variants]: _<{[unionSelectKey]: key} & VariantValue<Variants[key]>> }[keyof Variants] :
  unknown

type _<T> = T;
export type GuardAll<A> = GuardNumber<A> &
  GuardString<A> &
  GuardBoolean<A> &
  GuardObject<A> &
  GuardList<A> &
  GuardUnion<A> &
  GuardSelect<A> &
  GuardMultiselect<A>;
// prettier-ignore
export type TypeFromProps<A> =
  A extends Record<string, unknown> ? {  [K in keyof A & string]: _<GuardAll<A[K]>> } :
  unknown;

const isType = object({ type: string });
const matchVariant = object({
  name: string,
  spec: unknown,
});
const recordString = dictionary([string, unknown]);
const matchDefault = object({ default: unknown });
const matchNullable = object({ nullable: literals(true) });
const rangeRegex = /(\[|\()(\*|(\d|\.)+),(\*|(\d|\.)+)(\]|\))/;
const matchRange = object({ range: string });
const matchIntegral = object({ integral: literals(true) });
const matchSpec = object({ spec: recordString });
const matchSubType = object({ subtype: string });
const matchUnion = object({
  variants: dictionary([string, matchVariant]),
});
const matchValues = object({
  values: dictionary([string, string]),
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
 * @param generate.charset Pattern like "a-z" or "a-z,1-5"
 * @param generate.len Length to make random variable
 * @param param1
 * @returns
 */
export function generateDefault(generate: { charset: string; len: number }, { random = () => Math.random() } = {}) {
  const validCharSets: number[][] = generate.charset.split(",").map(charRange).filter(Array.isArray);
  if (validCharSets.length === 0) {
    throw new Error("Expecing that we have a valid charset");
  }
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

export function matchNumberWithRange(range: string) {
  const matched = rangeRegex.exec(range);
  if (!matched) return number;
  const [, left, leftValue, , rightValue, , right] = matched;
  return number
    .validate(
      leftValue === "*" ? (_) => true : left === "[" ? (x) => x >= Number(leftValue) : (x) => x > Number(leftValue),
      leftValue === "*" ? "any" : left === "[" ? `greaterThanOrEqualTo${leftValue}` : `greaterThan${leftValue}`
    )
    .validate(
      // prettier-ignore
      rightValue === "*" ? (_) => true :
        right === "]" ? (x) => x <= Number(rightValue) :
          (x) => x < Number(rightValue),
      // prettier-ignore
      rightValue === "*" ? "any" :
        right === "]" ? `lessThanOrEqualTo${rightValue}` :
          `lessThan${rightValue}`
    );
}
function withIntegral(parser: Parser<unknown, number>, value: unknown) {
  if (matchIntegral.test(value)) {
    return parser.validate(Number.isInteger, "isIntegral");
  }
  return parser;
}
function withRange(value: unknown) {
  if (matchRange.test(value)) {
    return matchNumberWithRange(value.range);
  }
  return number;
}
const isGenerator = object({
  charset: string,
  len: number,
}).test;
function defaultNullable<A>(parser: Parser<unknown, A>, value: unknown) {
  if (matchDefault.test(value)) {
    if (isGenerator(value.default)) {
      return parser.defaultTo(parser.unsafeCast(generateDefault(value.default)));
    }
    return parser.defaultTo(value.default);
  }
  if (matchNullable.test(value)) return parser.optional();
  return parser;
}

/**
 * InputSpec: Tells the UI how to ask for information, verification, and will send the service a config in a shape via the spec.
 * ValueSpecAny: This is any of the values in a config spec.
 *
 * Use this when we want to convert a value spec any into a parser for what a config will look like
 * @param value
 * @returns
 */
export function guardAll<A extends ValueSpecAny>(value: A): Parser<unknown, GuardAll<A>> {
  if (!isType.test(value)) {
    return unknown as any;
  }
  switch (value.type) {
    case "boolean":
      return defaultNullable(boolean, value) as any;

    case "string":
      return defaultNullable(string, value) as any;

    case "number":
      return defaultNullable(withIntegral(withRange(value), value), value) as any;

    case "object":
      if (matchSpec.test(value)) {
        return defaultNullable(typeFromProps(value.spec), value) as any;
      }
      return unknown as any;

    case "list": {
      const spec = (matchSpec.test(value) && value.spec) || {};
      const rangeValidate = (matchRange.test(value) && matchNumberWithRange(value.range).test) || (() => true);

      const subtype = matchSubType.unsafeCast(value).subtype;
      return defaultNullable(
        matches
          .arrayOf(guardAll({ type: subtype, ...spec } as any))
          .validate((x) => rangeValidate(x.length), "valid length"),
        value
      ) as any;
    }
    case "select":
      if (matchValues.test(value)) {
        const valueKeys = Object.keys(value.values);
        return defaultNullable(literals(valueKeys[0], ...valueKeys), value) as any;
      }
      return unknown as any;
    case "multiselect":
      if (matchValues.test(value)) {
        const rangeValidate = (matchRange.test(value) && matchNumberWithRange(value.range).test) || (() => true);

        const valueKeys = Object.keys(value.values);
        return defaultNullable(
          matches.literals(valueKeys[0], ...valueKeys).validate((x) => rangeValidate(x.length), "valid length"),
          value
        ) as any;
      }
      return unknown as any;
    case "union":
      if (matchUnion.test(value)) {
        return some(...Object.entries(value.variants).map(([_, { spec }]) => typeFromProps(spec))) as any;
      }
      return unknown as any;
  }

  return unknown as any;
}
/**
 * InputSpec: Tells the UI how to ask for information, verification, and will send the service a config in a shape via the spec.
 * ValueSpecAny: This is any of the values in a config spec.
 *
 * Use this when we want to convert a config spec into a parser for what a config will look like
 * @param valueDictionary
 * @returns
 */
export function typeFromProps<A extends InputSpec>(valueDictionary: A): Parser<unknown, TypeFromProps<A>> {
  if (!recordString.test(valueDictionary)) return unknown as any;
  return object(
    Object.fromEntries(Object.entries(valueDictionary).map(([key, value]) => [key, guardAll(value)]))
  ) as any;
}
