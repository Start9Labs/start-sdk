import * as C from "./configTypesRaw";

export type ValueType = C.ValueType;

export type InputSpec = Record<string, Required<C.ValueSpec>>;

export type ValueSpec = Required<C.ValueSpec>;

/** core spec types. These types provide the metadata for performing validations */
export type ValueSpecOf<T extends ValueType> = Required<C.ValueSpecOf<T>>;

export type ValueSpecString = Required<C.ValueSpecString>;
export type ValueSpecTextarea = Required<C.ValueSpecTextarea>;
export type ValueSpecNumber = Required<C.ValueSpecNumber>;
export type ValueSpecSelect = Required<C.ValueSpecSelect>;
export type ValueSpecMultiselect = Required<C.ValueSpecMultiselect>;
export type ValueSpecBoolean = Required<C.ValueSpecBoolean>;
export type ValueSpecUnion = Required<C.ValueSpecUnion>;
export type ValueSpecFile = Required<C.ValueSpecFile>;
export type ValueSpecObject = Required<C.ValueSpecObject>;
export type WithStandalone = Required<C.WithStandalone>;
export type SelectBase = Required<C.SelectBase>;
export type ListValueSpecType = Required<C.ListValueSpecType>;

/** represents a spec for the values of a list */
export type ListValueSpecOf<T extends ListValueSpecType> = Required<
  C.ListValueSpecOf<T>
>;

/** represents a spec for a list */
export type ValueSpecList = Required<C.ValueSpecList>;
export type ValueSpecListOf<T extends ListValueSpecType> = Required<
  C.ValueSpecListOf<T>
>;

// sometimes the type checker needs just a little bit of help
export function isValueSpecListOf<S extends ListValueSpecType>(
  t: ValueSpecListOf<ListValueSpecType>,
  s: S
): t is ValueSpecListOf<S> & { spec: ListValueSpecOf<S> } {
  return t.spec.type === s;
}
export type ListValueSpecString = Required<C.ListValueSpecString>;
export type ListValueSpecNumber = Required<C.ListValueSpecNumber>;
export type ListValueSpecObject = Required<C.ListValueSpecObject>;
export type UniqueBy = Required<C.UniqueBy>;
export type DefaultString = Required<C.DefaultString>;

export const unionSelectKey = "unionSelectKey" as const;
export type UnionSelectKey = typeof unionSelectKey;

export const unionValueKey = "unionValueKey" as const;
export type UnionValueKey = typeof unionValueKey;
