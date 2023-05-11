import { Config } from "../config/builder/config"
import { Address, Effects } from "../types"
import { Utils } from "../util/utils"
import { AddressReceipt } from "./AddressReceipt"

export type SetInterfacesReceipt = Record<string, Address[] & AddressReceipt>
export type SetInterfaces<
  Store,
  Vault,
  ConfigInput extends Record<string, any>,
  Output extends Record<string, Address[] & AddressReceipt>,
> = (opts: {
  effects: Effects
  input: null | ConfigInput
  utils: Utils<Store, Vault>
}) => Promise<Output>
export type SetupInterfaces = <
  Store,
  Vault,
  ConfigInput extends Record<string, any>,
  Output extends Record<string, Address[] & AddressReceipt>,
>(
  config: Config<ConfigInput, Store, Vault>,
  fn: SetInterfaces<Store, Vault, ConfigInput, Output>,
) => SetInterfaces<Store, Vault, ConfigInput, Output>
export const NO_INTERFACE_CHANGES = {} as SetInterfacesReceipt
export const setupInterfaces: SetupInterfaces = (_config, fn) => fn
