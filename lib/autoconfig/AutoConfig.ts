import { AutoConfigure, DeepPartial, Effects, ExpectedExports } from "../types"
import { Utils, utils } from "../util/utils"
import { deepEqual } from "../util/deepEqual"
import { deepMerge } from "../util/deepMerge"
import { Config } from "../config/builder/config"

export type AutoConfigFrom<
  Store,
  Input,
  NestedConfigs extends Record<string, any>,
> = {
  [key in keyof NestedConfigs & string]: {
    serviceConfig: Config<NestedConfigs[key], any>
    autoConfig: (options: {
      effects: Effects
      localConfig: Input
      remoteConfig: NestedConfigs[key]
      utils: Utils<Store>
    }) => Promise<void | DeepPartial<NestedConfigs[key]>>
  }
}
export class AutoConfig<
  Store,
  Input,
  NestedConfigs extends Record<string, any>,
> {
  constructor(
    readonly configs: AutoConfigFrom<Store, Input, NestedConfigs>,
    readonly path: keyof AutoConfigFrom<Store, Input, NestedConfigs>,
  ) {}

  async check(
    options: Parameters<AutoConfigure["check"]>[0],
  ): ReturnType<AutoConfigure["check"]> {
    const origConfig = JSON.parse(JSON.stringify(options.localConfig))
    const newOptions = {
      ...options,
      utils: utils<Store>(options.effects),
      localConfig: options.localConfig as Input,
      remoteConfig: options.remoteConfig as any,
    }
    if (
      !deepEqual(
        origConfig,
        deepMerge(
          {},
          options.localConfig,
          await this.configs[this.path].autoConfig(newOptions),
        ),
      )
    )
      throw new Error(`Check failed for ${this.path}`)
  }
  async autoConfigure(
    options: Parameters<AutoConfigure["autoConfigure"]>[0],
  ): ReturnType<AutoConfigure["autoConfigure"]> {
    const newOptions = {
      ...options,
      utils: utils<Store>(options.effects),
      localConfig: options.localConfig as Input,
      remoteConfig: options.remoteConfig as any,
    }
    return deepMerge(
      {},
      options.localConfig,
      await this.configs[this.path].autoConfig(newOptions),
    )
  }
}
