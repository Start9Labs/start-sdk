import * as C from "./configTypesRaw";

export type ValueType = C.ValueType;
// prettier-ignore
export type WithOutOptionals<A> = 
  A extends Record<string | number, unknown> ? {[k in keyof A]: A[k]} :
  A;

export type InputSpec = Record<string, WithOutOptionals<C.ValueSpec>>;

export type ValueSpec = WithOutOptionals<C.ValueSpec>;

/** core spec types. These types provide the metadata for performing validations */
export type ValueSpecOf<T extends ValueType> = WithOutOptionals<
  C.ValueSpecOf<T>
>;

export type ValueSpecString = WithOutOptionals<C.ValueSpecString>;
export type ValueSpecTextarea = WithOutOptionals<C.ValueSpecTextarea>;
export type ValueSpecNumber = WithOutOptionals<C.ValueSpecNumber>;
export type ValueSpecSelect = WithOutOptionals<C.ValueSpecSelect>;
export type ValueSpecMultiselect = WithOutOptionals<C.ValueSpecMultiselect>;
export type ValueSpecBoolean = WithOutOptionals<C.ValueSpecBoolean>;
export type ValueSpecUnion = WithOutOptionals<C.ValueSpecUnion>;
export type ValueSpecFile = WithOutOptionals<C.ValueSpecFile>;
export type ValueSpecObject = WithOutOptionals<C.ValueSpecObject>;
export type WithStandalone = WithOutOptionals<C.WithStandalone>;
export type SelectBase = WithOutOptionals<C.SelectBase>;
export type ListValueSpecType = WithOutOptionals<C.ListValueSpecType>;

/** represents a spec for the values of a list */
export type ListValueSpecOf<T extends ListValueSpecType> = WithOutOptionals<
  C.ListValueSpecOf<T>
>;

/** represents a spec for a list */
export type ValueSpecList = WithOutOptionals<C.ValueSpecList>;
export type ValueSpecListOf<T extends ListValueSpecType> = WithOutOptionals<
  C.ValueSpecListOf<T>
>;

// sometimes the type checker needs just a little bit of help
export function isValueSpecListOf<S extends ListValueSpecType>(
  t: ValueSpecListOf<ListValueSpecType>,
  s: S
): t is ValueSpecListOf<S> & { spec: ListValueSpecOf<S> } {
  return t.spec.type === s;
}
export type ListValueSpecString = WithOutOptionals<C.ListValueSpecString>;
export type ListValueSpecNumber = WithOutOptionals<C.ListValueSpecNumber>;
export type ListValueSpecObject = WithOutOptionals<C.ListValueSpecObject>;
export type UniqueBy = WithOutOptionals<C.UniqueBy>;
export type DefaultString = WithOutOptionals<C.DefaultString>;

export const unionSelectKey = "unionSelectKey" as const;
export type UnionSelectKey = typeof unionSelectKey;

export const unionValueKey = "unionValueKey" as const;
export type UnionValueKey = typeof unionValueKey;
