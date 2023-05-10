import { AutoConfigure, DeepPartial, Effects, ExpectedExports } from "../types"
import { Utils, utils } from "../util/utils"
import { deepEqual } from "../util/deepEqual"
import { deepMerge } from "../util/deepMerge"
import { Config } from "../config/builder/config"

export class AutoConfig<
  Store,
  Vault,
  Input extends Record<string, any>,
  RemoteConfig extends Record<string, any>,
> {
  constructor(
    readonly autoconfig: (options: {
      effects: Effects
      localConfig: Input
      remoteConfig: RemoteConfig
      utils: Utils<Store, Vault>
    }) => Promise<void | DeepPartial<RemoteConfig>>,
  ) {}

  async check(
    options: Parameters<AutoConfigure["check"]>[0],
  ): ReturnType<AutoConfigure["check"]> {
    const origConfig = JSON.parse(JSON.stringify(options.localConfig))
    const newOptions = {
      ...options,
      utils: utils<Store, Vault>(options.effects),
      localConfig: options.localConfig as Input,
      remoteConfig: options.remoteConfig as RemoteConfig,
    }
    if (
      !deepEqual(
        origConfig,
        deepMerge({}, options.localConfig, await this.autoconfig(newOptions)),
      )
    )
      throw new Error(`Check failed`)
  }
  async autoConfigure(
    options: Parameters<AutoConfigure["autoConfigure"]>[0],
  ): ReturnType<AutoConfigure["autoConfigure"]> {
    const newOptions = {
      ...options,
      utils: utils<Store, Vault>(options.effects),
      localConfig: options.localConfig as Input,
      remoteConfig: options.remoteConfig as any,
    }
    return deepMerge(
      {},
      options.remoteConfig,
      await this.autoconfig(newOptions),
    )
  }
}
