import * as matches from "ts-matches"
import { Parser, Validator } from "ts-matches"
import {
  UnionSelectKey,
  UnionValueKey,
  ValueSpec as ValueSpecAny,
  InputSpec,
} from "../config/configTypes"
import { Config } from "../config/builder/config"
import { _ } from "../util"

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
  nill,
} = matches

type TypeToggle = "toggle"
type TypeText = "text"
type TypeTextarea = "textarea"
type TypeNumber = "number"
type TypeObject = "object"
type TypeList = "list"
type TypeSelect = "select"
type TypeMultiselect = "multiselect"
type TypeColor = "color"
type TypeDatetime = "datetime"
type TypeUnion = "union"

// prettier-ignore
type GuardDefaultRequired<A, Type> =
  A extends {  required: false; default: null | undefined | never } ? Type | undefined | null:
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

type TrueKeyOf<T> = _<T> extends Record<string, unknown> ? keyof T : never
// prettier-ignore
type GuardObject<A> =
  A extends {  type: TypeObject,  spec: infer B } ? (
     {  [K in TrueKeyOf<B> & string]: _<GuardAll<B[K]>> } 
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
    GuardDefaultRequired<A, TrueKeyOf<B>>
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
type AsString<A> = A extends
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  ? `${A}`
  : "UnknownValue"
// prettier-ignore
type VariantValue<A> =
  A extends { name: string, spec: infer B } ?  TypeFromProps<_<B>>  :
  `neverVariantValue${AsString<A>}`
// prettier-ignore
type GuardUnion<A> =
  A extends {  type: TypeUnion, variants: infer Variants & Record<string, unknown> } ? (
    _<{[key in keyof Variants]: {[k in UnionSelectKey]: key} & {[k in UnionValueKey]: VariantValue<Variants[key]>}}[keyof Variants]>
  ) :
  unknown

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
  GuardDatetime<A>
// prettier-ignore
export type TypeFromProps<A> =
  A extends Config<infer B> ? TypeFromProps<B> :
  A extends Record<string, unknown> ? {  [K in keyof A & string]: _<GuardAll<A[K]>> } :
  unknown;
const isType = object({ type: string })
const matchVariant = object({
  name: string,
  spec: unknown,
})
const recordString = dictionary([string, unknown])
const matchDefault = object({ default: unknown })
const matchRequired = object(
  {
    required: literals(false),
    default: nill,
  },
  ["default"],
)
const matchInteger = object({ integer: literals(true) })
const matchSpec = object({ spec: recordString })
const matchUnion = object({
  variants: dictionary([string, matchVariant]),
})
const matchValues = object({
  values: dictionary([string, string]),
})

function withInteger(parser: Parser<unknown, number>, value: unknown) {
  if (matchInteger.test(value)) {
    return parser.validate(Number.isInteger, "isIntegral")
  }
  return parser
}
function requiredParser<A>(parser: Parser<unknown, A>, value: unknown) {
  if (matchRequired.test(value)) return parser.optional()
  return parser
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
    return unknown as any
  }
  switch (value.type) {
    case "toggle":
      return requiredParser(boolean, value) as any

    case "text":
      return requiredParser(string, value) as any

    case "textarea":
      return requiredParser(string, value) as any

    case "color":
      return requiredParser(string, value) as any

    case "datetime":
      return requiredParser(string, value) as any

    case "number":
      return requiredParser(withInteger(number, value), value) as any

    case "object":
      if (matchSpec.test(value)) {
        return requiredParser(typeFromProps(value.spec), value) as any
      }
      return unknown as any

    case "list": {
      const spec = (matchSpec.test(value) && value.spec) || {}

      return requiredParser(
        matches.arrayOf(guardAll(spec as any)),
        value,
      ) as any
    }
    case "select":
      if (matchValues.test(value)) {
        const valueKeys = Object.keys(value.values)
        return requiredParser(
          literals(valueKeys[0], ...valueKeys),
          value,
        ) as any
      }
      return unknown as any

    case "multiselect":
      if (matchValues.test(value)) {
        const valueKeys = Object.keys(value.values)
        return requiredParser(
          arrayOf(literals(valueKeys[0], ...valueKeys)),
          value,
        ) as any
      }
      return unknown as any

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
        ) as any
      }
      return unknown as any
  }

  return unknown as any
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
  if (!recordString.test(valueDictionary)) return unknown as any
  return object(
    Object.fromEntries(
      Object.entries(valueDictionary).map(([key, value]) => [
        key,
        guardAll(value),
      ]),
    ),
  ) as any
}
