export declare const wrapperDataContractType: unique symbol
export type WrapperDataContract<A> = {
  [wrapperDataContractType]: A
}
export const neverWrapperDataContract: WrapperDataContract<never> = null as any
/**
 * Used to indicate the type of the wrapper data. To be used in areas where
 * we need to know the wrapper data value
 */
export function createWrapperDataContract<A = never>(): A extends never
  ? "Wrapper Data Contract must be created with a generic"
  : WrapperDataContract<A> {
  return null as any
}
