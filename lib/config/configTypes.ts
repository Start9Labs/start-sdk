import * as C from "./configTypesRaw";

export type ValueType = C.ValueType;

export type RequiredDeep<A> = A extends {}
  ? { [K in keyof A]-?: RequiredDeep<A[K]> }
  : Required<A>;

export type InputSpec = Record<string, RequiredDeep<C.ValueSpec>>;

export type ValueSpec = RequiredDeep<C.ValueSpec>;

/** core spec types. These types provide the metadata for performing validations */
export type ValueSpecOf<T extends ValueType> = RequiredDeep<C.ValueSpecOf<T>>;

export type ValueSpecString = RequiredDeep<C.ValueSpecString>;
export type ValueSpecTextarea = RequiredDeep<C.ValueSpecTextarea>;
export type ValueSpecNumber = RequiredDeep<C.ValueSpecNumber>;
export type ValueSpecSelect = RequiredDeep<C.ValueSpecSelect>;
export type ValueSpecMultiselect = RequiredDeep<C.ValueSpecMultiselect>;
export type ValueSpecBoolean = RequiredDeep<C.ValueSpecBoolean>;
export type ValueSpecUnion = RequiredDeep<C.ValueSpecUnion>;
export type ValueSpecFile = RequiredDeep<C.ValueSpecFile>;
export type ValueSpecObject = RequiredDeep<C.ValueSpecObject>;
export type WithStandalone = RequiredDeep<C.WithStandalone>;
export type SelectBase = RequiredDeep<C.SelectBase>;
export type ListValueSpecType = RequiredDeep<C.ListValueSpecType>;

/** represents a spec for the values of a list */
export type ListValueSpecOf<T extends ListValueSpecType> = RequiredDeep<
  C.ListValueSpecOf<T>
>;

/** represents a spec for a list */
export type ValueSpecList = RequiredDeep<C.ValueSpecList>;
export type ValueSpecListOf<T extends ListValueSpecType> = RequiredDeep<
  C.ValueSpecListOf<T>
>;

// sometimes the type checker needs just a little bit of help
export function isValueSpecListOf<S extends ListValueSpecType>(
  t: ValueSpecListOf<ListValueSpecType>,
  s: S
): t is ValueSpecListOf<S> & { spec: ListValueSpecOf<S> } {
  return t.spec.type === s;
}
export type ListValueSpecString = RequiredDeep<C.ListValueSpecString>;
export type ListValueSpecNumber = RequiredDeep<C.ListValueSpecNumber>;
export type ListValueSpecObject = RequiredDeep<C.ListValueSpecObject>;
export type UniqueBy = RequiredDeep<C.UniqueBy>;
export type DefaultString = RequiredDeep<C.DefaultString>;

export const unionSelectKey = "unionSelectKey" as const;
export type UnionSelectKey = typeof unionSelectKey;

export const unionValueKey = "unionValueKey" as const;
export type UnionValueKey = typeof unionValueKey;
