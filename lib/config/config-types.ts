export type InputSpec = Record<string, ValueSpec>;

export type ValueType =
  | "string"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "multiselect"
  | "list"
  | "object"
  | "file"
  | "union";
export type ValueSpec = ValueSpecOf<ValueType>;

/** core spec types. These types provide the metadata for performing validations */
export type ValueSpecOf<T extends ValueType> = T extends "string"
  ? ValueSpecString
  : T extends "number"
  ? ValueSpecTextarea
  : T extends "textarea"
  ? ValueSpecNumber
  : T extends "boolean"
  ? ValueSpecBoolean
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
  : never;

export interface ValueSpecString extends ListValueSpecString, WithStandalone {
  required: boolean;
  default: DefaultString | null;
}

export interface ValueSpecTextarea extends WithStandalone {
  type: "textarea";
  placeholder: string | null;
  required: boolean;
}

export interface ValueSpecNumber extends ListValueSpecNumber, WithStandalone {
  required: boolean;
  default: number | null;
}

export interface ValueSpecSelect extends SelectBase, WithStandalone {
  type: "select";
  required: boolean;
  default: string | null;
}

export interface ValueSpecMultiselect extends SelectBase, WithStandalone {
  type: "multiselect";
  /**'[0,1]' (inclusive) OR '[0,*)' (right unbounded), normal math rules */
  range: string;
  default: string[];
}

export interface ValueSpecBoolean extends WithStandalone {
  type: "boolean";
  default: boolean | null;
}

export interface ValueSpecUnion extends WithStandalone {
  type: "union";
  variants: Record<string, { name: string; spec: InputSpec }>;
  required: boolean;
  default: string | null;
}

export interface ValueSpecFile extends WithStandalone {
  type: "file";
  extensions: string[];
  required: boolean;
}

export interface ValueSpecObject extends WithStandalone {
  type: "object";
  spec: InputSpec;
}

export interface WithStandalone {
  name: string;
  description: string | null;
  warning: string | null;
}

export interface SelectBase {
  values: Record<string, string>;
}

export type ListValueSpecType = "string" | "number" | "object";

/** represents a spec for the values of a list */
export type ListValueSpecOf<T extends ListValueSpecType> = T extends "string"
  ? ListValueSpecString
  : T extends "number"
  ? ListValueSpecNumber
  : T extends "object"
  ? ListValueSpecObject
  : never;

/** represents a spec for a list */
export type ValueSpecList = ValueSpecListOf<ListValueSpecType>;
export interface ValueSpecListOf<T extends ListValueSpecType>
  extends WithStandalone {
  type: "list";
  spec: ListValueSpecOf<T>;
  range: string; // '[0,1]' (inclusive) OR '[0,*)' (right unbounded), normal math rules
  default:
    | string[]
    | number[]
    | DefaultString[]
    | Record<string, unknown>[]
    | readonly string[]
    | readonly number[]
    | readonly DefaultString[]
    | readonly Record<string, unknown>[];
}

// sometimes the type checker needs just a little bit of help
export function isValueSpecListOf<S extends ListValueSpecType>(
  t: ValueSpecList,
  s: S
): t is ValueSpecListOf<S> {
  return t.spec.type === s;
}

export interface ListValueSpecString {
  type: 'string'
  pattern: string | null;
  patternDescription: string | null;
  masked: boolean; // default = false
  inputmode: 'text' | 'email' | 'tel' | 'url'; // default = 'text'
  placeholder: string | null;
}

export interface ListValueSpecNumber {
  type: 'number';
  /** '[0,1]' (inclusive) OR '[0,*)' (right unbounded), normal math rules */
  range: string;
  integral: boolean; // default = false
  units: string | null;
  placeholder: string | null;
}

export interface ListValueSpecObject {
  type: 'object';
  /** this is a mapped type of the config object at this level, replacing the object's values with specs on those values */
  spec: InputSpec;
  /** indicates whether duplicates can be permitted in the list */
  uniqueBy: UniqueBy;
  /** this should be a handlebars template which can make use of the entire config which corresponds to 'spec' */
  displayAs: string | null;
}

export type UniqueBy =
  | null
  | string
  | { any: readonly UniqueBy[] | UniqueBy[] }
  | { all: readonly UniqueBy[] | UniqueBy[] };

export type DefaultString = string | { charset: string; len: number };

export const unionSelectKey = "unionSelectKey" as const;
export type UnionSelectKey = typeof unionSelectKey;
