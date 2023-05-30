import { Config } from "../config/builder/config"
import { Address, Effects } from "../types"
import { Utils } from "../util/utils"
import { AddressReceipt } from "./AddressReceipt"

export type InterfacesReceipt = Array<Address[] & AddressReceipt>
export type SetInterfaces<
  Store,
  ConfigInput extends Record<string, any>,
  Output extends InterfacesReceipt,
> = (opts: {
  effects: Effects
  input: null | ConfigInput
  utils: Utils<Store>
}) => Promise<Output>
export type SetupInterfaces = <
  Store,
  ConfigInput extends Record<string, any>,
  Output extends InterfacesReceipt,
>(
  config: Config<ConfigInput, Store>,
  fn: SetInterfaces<Store, ConfigInput, Output>,
) => SetInterfaces<Store, ConfigInput, Output>
export const NO_INTERFACE_CHANGES = [] as InterfacesReceipt
export const setupInterfaces: SetupInterfaces = (_config, fn) => fn
