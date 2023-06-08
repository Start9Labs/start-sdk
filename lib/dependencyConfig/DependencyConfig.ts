import {
  DependencyConfig as DependencyConfigType,
  DeepPartial,
  Effects,
} from "../types"
import { Utils, utils } from "../util/utils"
import { deepEqual } from "../util/deepEqual"
import { deepMerge } from "../util/deepMerge"

export type Update<QueryResults, RemoteConfig> = (options: {
  remoteConfig: RemoteConfig
  queryResults: QueryResults
}) => Promise<RemoteConfig>

export class DependencyConfig<
  Store,
  Input extends Record<string, any>,
  RemoteConfig extends Record<string, any>,
> {
  static defaultUpdate = async (options: {
    queryResults: unknown
    remoteConfig: unknown
  }): Promise<unknown> => {
    return deepMerge({}, options.remoteConfig, options.queryResults || {})
  }
  constructor(
    readonly dependencyConfig: (options: {
      effects: Effects
      localConfig: Input
      utils: Utils<Store>
    }) => Promise<void | DeepPartial<RemoteConfig>>,
    readonly update: Update<
      void | DeepPartial<RemoteConfig>,
      RemoteConfig
    > = DependencyConfig.defaultUpdate as any,
  ) {}

  async query(options: { effects: Effects; localConfig: unknown }) {
    return this.dependencyConfig({
      localConfig: options.localConfig as Input,
      effects: options.effects,
      utils: utils<Store>(options.effects),
    })
  }
}
