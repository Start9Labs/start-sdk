import {
  DependencyConfig as DependencyConfigType,
  DeepPartial,
  Effects,
} from "../types"
import { Utils, utils } from "../util/utils"
import { deepEqual } from "../util/deepEqual"
import { deepMerge } from "../util/deepMerge"

export class DependencyConfig<
  Store,
  Input extends Record<string, any>,
  RemoteConfig extends Record<string, any>,
> {
  constructor(
    readonly dependencyConfig: (options: {
      effects: Effects
      localConfig: Input
      remoteConfig: RemoteConfig
      utils: Utils<Store>
    }) => Promise<void | DeepPartial<RemoteConfig>>,
  ) {}

  async check(
    options: Parameters<DependencyConfigType["check"]>[0],
  ): ReturnType<DependencyConfigType["check"]> {
    const origConfig = JSON.parse(JSON.stringify(options.localConfig))
    const newOptions = {
      ...options,
      utils: utils<Store>(options.effects),
      localConfig: options.localConfig as Input,
      remoteConfig: options.remoteConfig as RemoteConfig,
    }
    if (
      !deepEqual(
        origConfig,
        deepMerge(
          {},
          options.localConfig,
          await this.dependencyConfig(newOptions),
        ),
      )
    )
      throw new Error(`Check failed`)
  }
  async autoConfigure(
    options: Parameters<DependencyConfigType["autoConfigure"]>[0],
  ): ReturnType<DependencyConfigType["autoConfigure"]> {
    const newOptions = {
      ...options,
      utils: utils<Store>(options.effects),
      localConfig: options.localConfig as Input,
      remoteConfig: options.remoteConfig as any,
    }
    return deepMerge(
      {},
      options.remoteConfig,
      await this.dependencyConfig(newOptions),
    )
  }
}
