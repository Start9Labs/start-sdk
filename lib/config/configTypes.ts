export type InputSpec = Record<string, ValueSpec>
export type ValueType =
  | "text"
  | "textarea"
  | "number"
  | "color"
  | "datetime"
  | "toggle"
  | "select"
  | "multiselect"
  | "list"
  | "object"
  | "file"
  | "union"
export type ValueSpec = ValueSpecOf<ValueType>
/** core spec types. These types provide the metadata for performing validations */
export type ValueSpecOf<T extends ValueType> = T extends "text"
  ? ValueSpecText
  : T extends "textarea"
  ? ValueSpecTextarea
  : T extends "number"
  ? ValueSpecNumber
  : T extends "color"
  ? ValueSpecColor
  : T extends "datetime"
  ? ValueSpecDatetime
  : T extends "toggle"
  ? ValueSpecToggle
  : T extends "select"
  ? ValueSpecSelect
  : T extends "multiselect"
  ? ValueSpecMultiselect
  : T extends "list"
  ? ValueSpecList
  : T extends "object"
  ? ValueSpecObject
  : T extends "file"
  ? ValueSpecFile
  : T extends "union"
  ? ValueSpecUnion
  : never

export interface ValueSpecText extends ListValueSpecText, WithStandalone {
  required: boolean
  default: DefaultString | null
}
export interface ValueSpecTextarea extends WithStandalone {
  type: "textarea"
  placeholder: string | null
  minLength: number | null
  maxLength: number | null
  required: boolean
}
export interface ValueSpecNumber extends ListValueSpecNumber, WithStandalone {
  required: boolean
  default: number | null
}
export interface ValueSpecColor extends WithStandalone {
  type: "color"
  required: boolean
  default: string | null
}
export interface ValueSpecDatetime extends WithStandalone {
  type: "datetime"
  required: boolean
  inputmode: "date" | "time" | "datetime-local"
  min: string | null
  max: string | null
  step: string | null
  default: string | null
}
export interface ValueSpecSelect extends SelectBase, WithStandalone {
  type: "select"
  required: boolean
  default: string | null
}
export interface ValueSpecMultiselect extends SelectBase, WithStandalone {
  type: "multiselect"
  minLength: number | null
  maxLength: number | null
  default: string[]
}
export interface ValueSpecToggle extends WithStandalone {
  type: "toggle"
  default: boolean | null
}
export interface ValueSpecUnion extends WithStandalone {
  type: "union"
  variants: Record<
    string,
    {
      name: string
      spec: InputSpec
    }
  >
  required: boolean
  default: string | null
}
export interface ValueSpecFile extends WithStandalone {
  type: "file"
  extensions: string[]
  required: boolean
}
export interface ValueSpecObject extends WithStandalone {
  type: "object"
  spec: InputSpec
}
export interface WithStandalone {
  name: string
  description: string | null
  warning: string | null
}
export interface SelectBase {
  values: Record<string, string>
}
export type ListValueSpecType = "text" | "number" | "object"
/** represents a spec for the values of a list */
export type ListValueSpecOf<T extends ListValueSpecType> = T extends "text"
  ? ListValueSpecText
  : T extends "number"
  ? ListValueSpecNumber
  : T extends "object"
  ? ListValueSpecObject
  : never
/** represents a spec for a list */
export type ValueSpecList = ValueSpecListOf<ListValueSpecType>
export interface ValueSpecListOf<T extends ListValueSpecType>
  extends WithStandalone {
  type: "list"
  spec: ListValueSpecOf<T>
  minLength: number | null
  maxLength: number | null
  default:
    | string[]
    | number[]
    | DefaultString[]
    | Record<string, unknown>[]
    | readonly string[]
    | readonly number[]
    | readonly DefaultString[]
    | readonly Record<string, unknown>[]
}
export interface Pattern {
  regex: string
  description: string
}
export interface ListValueSpecText {
  type: "text"
  patterns: Pattern[]
  minLength: number | null
  maxLength: number | null
  masked: boolean
  inputmode: "text" | "email" | "tel" | "url"
  placeholder: string | null
}
export interface ListValueSpecNumber {
  type: "number"
  min: number | null
  max: number | null
  integer: boolean
  step: string | null
  units: string | null
  placeholder: string | null
}
export interface ListValueSpecObject {
  type: "object"
  /** this is a mapped type of the config object at this level, replacing the object's values with specs on those values */
  spec: InputSpec
  /** indicates whether duplicates can be permitted in the list */
  uniqueBy: UniqueBy
  /** this should be a handlebars template which can make use of the entire config which corresponds to 'spec' */
  displayAs: string | null
}
export type UniqueBy =
  | null
  | string
  | {
      any: readonly UniqueBy[] | UniqueBy[]
    }
  | {
      all: readonly UniqueBy[] | UniqueBy[]
    }
export type DefaultString =
  | string
  | {
      charset: string
      len: number
    }

// sometimes the type checker needs just a little bit of help
export function isValueSpecListOf<S extends ListValueSpecType>(
  t: ValueSpecListOf<ListValueSpecType>,
  s: S,
): t is ValueSpecListOf<S> & { spec: ListValueSpecOf<S> } {
  return t.spec.type === s
}
export const unionSelectKey = "unionSelectKey" as const
export type UnionSelectKey = typeof unionSelectKey

export const unionValueKey = "unionValueKey" as const
export type UnionValueKey = typeof unionValueKey
