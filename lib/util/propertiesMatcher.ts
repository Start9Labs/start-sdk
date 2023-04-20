import * as matches from "ts-matches";
import { Parser, Validator } from "ts-matches";
import {
  UnionSelectKey,
  UnionValueKey,
  ValueSpec as ValueSpecAny,
  InputSpec,
} from "../config/configTypes";

const {
  string,
  some,
  arrayOf,
  object,
  dictionary,
  unknown,
  number,
  literals,
  boolean,
} = matches;

type TypeToggle = "toggle";
type TypeText = "text";
type TypeTextarea = "textarea";
type TypeNumber = "number";
type TypeObject = "object";
type TypeList = "list";
type TypeSelect = "select";
type TypeMultiselect = "multiselect";
type TypeColor = "color";
type TypeDatetime = "datetime";
type TypeUnion = "union";

// prettier-ignore
type GuardDefaultRequired<A, Type> =
  A extends {  default: unknown } ? Type :
  A extends {  required: false } ? Type :
  A extends {  required: true } ? Type | null | undefined :
  Type

// prettier-ignore
type GuardNumber<A> =
  A extends {  type: TypeNumber } ? GuardDefaultRequired<A, number> :
  unknown
// prettier-ignore
type GuardText<A> =
  A extends {  type: TypeText } ? GuardDefaultRequired<A, string> :
  unknown
// prettier-ignore
type GuardTextarea<A> =
  A extends {  type: TypeTextarea } ? GuardDefaultRequired<A, string> :
  unknown
// prettier-ignore
type GuardToggle<A> =
  A extends {  type: TypeToggle } ? GuardDefaultRequired<A, boolean> :
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
  A extends {  type: TypeList, spec?: { type: infer B, spec?: infer C } } ? Array<GuardAll<Omit<A, "type" | "spec"> & ({ type: B, spec: C })>> :
  A extends {  type: TypeList, spec?: { type: infer B } } ? Array<GuardAll<Omit<A, "type"> & ({ type: B })>> :
  unknown
// prettier-ignore
type GuardSelect<A> =
  A extends {  type: TypeSelect, values: infer B } ? (
    B extends Record<string, string> ? keyof B : never
  ) :
  unknown
// prettier-ignore
type GuardMultiselect<A> =
    A extends {  type: TypeMultiselect, values: infer B} ?(keyof B)[] :
unknown
// prettier-ignore
type GuardColor<A> =
  A extends {  type: TypeColor } ? GuardDefaultRequired<A, string> :
  unknown
  // prettier-ignore
type GuardDatetime<A> =
A extends {  type: TypeDatetime } ? GuardDefaultRequired<A, string> :
unknown

// prettier-ignore
type VariantValue<A> =
  A extends { name: string, spec: infer B } ?  TypeFromProps<B>  :
  never
// prettier-ignore
type GuardUnion<A> =
  A extends {  type: TypeUnion, variants: infer Variants & Record<string, unknown> } ? (
    _<{[key in keyof Variants]: {[k in UnionSelectKey]: key} & {[k in UnionValueKey]: VariantValue<Variants[key]>}}[keyof Variants]>
  ) :
  unknown

type _<T> = T;
export type GuardAll<A> = GuardNumber<A> &
  GuardText<A> &
  GuardTextarea<A> &
  GuardToggle<A> &
  GuardObject<A> &
  GuardList<A> &
  GuardUnion<A> &
  GuardSelect<A> &
  GuardMultiselect<A> &
  GuardColor<A> &
  GuardDatetime<A>;
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
const matchRequired = object({ required: literals(false) });
const rangeRegex = /(\[|\()(\*|(\d|\.)+),(\*|(\d|\.)+)(\]|\))/;
const matchRange = object({ range: string });
const matchInteger = object({ integer: literals(true) });
const matchSpec = object({ spec: recordString });
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
export function generateDefault(
  generate: { charset: string; len: number },
  { random = () => Math.random() } = {},
) {
  const validCharSets: number[][] = generate.charset
    .split(",")
    .map(charRange)
    .filter(Array.isArray);
  if (validCharSets.length === 0) {
    throw new Error("Expecing that we have a valid charset");
  }
  const max = validCharSets.reduce(
    (acc, x) => x.reduce((x, y) => Math.max(x, y), acc),
    0,
  );
  let i = 0;
  const answer: string[] = Array(generate.len);
  while (i < generate.len) {
    const nextValue = Math.round(random() * max);
    const inRange = validCharSets.reduce(
      (acc, [lower, upper]) =>
        acc || (nextValue >= lower && nextValue <= upper),
      false,
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
      leftValue === "*"
        ? (_) => true
        : left === "["
        ? (x) => x >= Number(leftValue)
        : (x) => x > Number(leftValue),
      leftValue === "*"
        ? "any"
        : left === "["
        ? `greaterThanOrEqualTo${leftValue}`
        : `greaterThan${leftValue}`,
    )
    .validate(
      // prettier-ignore
      rightValue === "*" ? (_) => true :
        right === "]" ? (x) => x <= Number(rightValue) :
          (x) => x < Number(rightValue),
      // prettier-ignore
      rightValue === "*" ? "any" :
        right === "]" ? `lessThanOrEqualTo${rightValue}` :
          `lessThan${rightValue}`,
    );
}
function withInteger(parser: Parser<unknown, number>, value: unknown) {
  if (matchInteger.test(value)) {
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
function defaultRequired<A>(parser: Parser<unknown, A>, value: unknown) {
  if (matchDefault.test(value)) {
    if (isGenerator(value.default)) {
      return parser.defaultTo(
        parser.unsafeCast(generateDefault(value.default)),
      );
    }
    return parser.defaultTo(value.default);
  }
  if (!matchRequired.test(value)) return parser.optional();
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
export function guardAll<A extends ValueSpecAny>(
  value: A,
): Parser<unknown, GuardAll<A>> {
  if (!isType.test(value)) {
    return unknown as any;
  }
  switch (value.type) {
    case "toggle":
      return defaultRequired(boolean, value) as any;

    case "text":
      return defaultRequired(string, value) as any;

    case "textarea":
      return defaultRequired(string, value) as any;

    case "color":
      return defaultRequired(string, value) as any;

    case "datetime":
      return defaultRequired(string, value) as any;

    case "number":
      return defaultRequired(
        withInteger(withRange(value), value),
        value,
      ) as any;

    case "object":
      if (matchSpec.test(value)) {
        return defaultRequired(typeFromProps(value.spec), value) as any;
      }
      return unknown as any;

    case "list": {
      const spec = (matchSpec.test(value) && value.spec) || {};
      const rangeValidate =
        (matchRange.test(value) && matchNumberWithRange(value.range).test) ||
        (() => true);

      return defaultRequired(
        matches
          .arrayOf(guardAll(spec as any))
          .validate((x) => rangeValidate(x.length), "valid length"),
        value,
      ) as any;
    }
    case "select":
      if (matchValues.test(value)) {
        const valueKeys = Object.keys(value.values);
        return defaultRequired(
          literals(valueKeys[0], ...valueKeys),
          value,
        ) as any;
      }
      return unknown as any;

    case "multiselect":
      if (matchValues.test(value)) {
        const maybeAddRangeValidate = <X extends Validator<unknown, B[]>, B>(
          x: X,
        ) => {
          if (!matchRange.test(value)) return x;
          return x.validate(
            (x) => matchNumberWithRange(value.range).test(x.length),
            "validLength",
          );
        };

        const valueKeys = Object.keys(value.values);
        return defaultRequired(
          maybeAddRangeValidate(arrayOf(literals(valueKeys[0], ...valueKeys))),
          value,
        ) as any;
      }
      return unknown as any;

    case "union":
      if (matchUnion.test(value)) {
        return some(
          ...Object.entries(value.variants)
            .filter(([name]) => string.test(name))
            .map(([name, { spec }]) =>
              object({
                unionSelectKey: literals(name),
                unionValueKey: typeFromProps(spec),
              }),
            ),
        ) as any;
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
export function typeFromProps<A extends InputSpec>(
  valueDictionary: A,
): Parser<unknown, TypeFromProps<A>> {
  if (!recordString.test(valueDictionary)) return unknown as any;
  return object(
    Object.fromEntries(
      Object.entries(valueDictionary).map(([key, value]) => [
        key,
        guardAll(value),
      ]),
    ),
  ) as any;
}
