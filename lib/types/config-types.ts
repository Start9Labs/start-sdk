export type InputSpec = Record<string, ValueSpec>;

export type ValueType =
  | "string"
  | "number"
  | "boolean"
  | "enum"
  | "list"
  | "object"
  | "union";
export type ValueSpec = ValueSpecOf<ValueType>;

// core spec types. These types provide the metadata for performing validations
export type ValueSpecOf<T extends ValueType> = T extends "string"
  ? ValueSpecString
  : T extends "number"
  ? ValueSpecNumber
  : T extends "boolean"
  ? ValueSpecBoolean
  : T extends "enum"
  ? ValueSpecEnum
  : T extends "list"
  ? ValueSpecList
  : T extends "object"
  ? ValueSpecObject
  : T extends "union"
  ? ValueSpecUnion
  : never;

export interface ValueSpecString extends ListValueSpecString, WithStandalone {
  type: "string";
  default: null | DefaultString;
  nullable: boolean;
  textarea: null | boolean;
}

export interface ValueSpecNumber extends ListValueSpecNumber, WithStandalone {
  type: "number";
  nullable: boolean;
  default: null | number;
}

export interface ValueSpecEnum extends ListValueSpecEnum, WithStandalone {
  type: "enum";
  default: string;
}

export interface ValueSpecBoolean extends WithStandalone {
  type: "boolean";
  default: boolean;
}

export interface ValueSpecUnion {
  type: "union";
  tag: UnionTagSpec;
  variants: { [key: string]: InputSpec };
  default: string;
}

export interface ValueSpecObject extends WithStandalone {
  type: "object";
  spec: InputSpec;
}

export interface WithStandalone {
  name: string;
  description: null | string;
  warning: null | string;
}

// no lists of booleans, lists
export type ListValueSpecType =
  | "string"
  | "number"
  | "enum"
  | "object"
  | "union";

// represents a spec for the values of a list
export type ListValueSpecOf<T extends ListValueSpecType> = T extends "string"
  ? ListValueSpecString
  : T extends "number"
  ? ListValueSpecNumber
  : T extends "enum"
  ? ListValueSpecEnum
  : T extends "object"
  ? ListValueSpecObject
  : T extends "union"
  ? ListValueSpecUnion
  : never;

// represents a spec for a list
export type ValueSpecList = ValueSpecListOf<ListValueSpecType>;
export interface ValueSpecListOf<T extends ListValueSpecType>
  extends WithStandalone {
  type: "list";
  subtype: T;
  spec: ListValueSpecOf<T>;
  range: string; // '[0,1]' (inclusive) OR '[0,*)' (right unbounded), normal math rules
  default:
    | string[]
    | number[]
    | DefaultString[]
    | object[]
    | readonly string[]
    | readonly number[]
    | readonly DefaultString[]
    | readonly object[];
}

// sometimes the type checker needs just a little bit of help
export function isValueSpecListOf<S extends ListValueSpecType>(
  t: ValueSpecList,
  s: S,
): t is ValueSpecListOf<S> {
  return t.subtype === s;
}

export interface ListValueSpecString {
  pattern: null | string;
  "pattern-description": null | string;
  masked: boolean;
  placeholder: null | string;
}

export interface ListValueSpecNumber {
  range: string;
  integral: boolean;
  units: null | string;
  placeholder: null | string;
}

export interface ListValueSpecEnum {
  values: string[] | readonly string[];
  "value-names": { [value: string]: string };
}

export interface ListValueSpecObject {
  spec: InputSpec; // this is a mapped type of the config object at this level, replacing the object's values with specs on those values
  "unique-by": UniqueBy; // indicates whether duplicates can be permitted in the list
  "display-as": null | string; // this should be a handlebars template which can make use of the entire config which corresponds to 'spec'
}

export type UniqueBy =
  | null
  | undefined
  | string
  | { any: readonly UniqueBy[] | UniqueBy[] }
  | { all: readonly UniqueBy[] | UniqueBy[] };

export interface ListValueSpecUnion {
  tag: UnionTagSpec;
  variants: { [key: string]: InputSpec };
  "display-as": null | string; // this may be a handlebars template which can conditionally (on tag.id) make use of each union's entries, or if left blank will display as tag.id
  "unique-by": UniqueBy;
  default: string; // this should be the variantName which one prefers a user to start with by default when creating a new union instance in a list
}

export interface UnionTagSpec {
  id: string; // The name of the field containing one of the union variants
  "variant-names": {
    // the name of each variant
    [variant: string]: string;
  };
  name: string;
  description: null | string;
  warning: null | string;
}

export type DefaultString = string | { charset: string; len: number };
