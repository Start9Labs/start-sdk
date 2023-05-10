import { Config } from "../config/builder/config"
import { SDKManifest } from "../manifest/ManifestTypes"
import { DependencyConfig } from "./DependencyConfig"

export function setupDependencyConfig<
  Store,
  Vault,
  Input extends Record<string, any>,
  Manifest extends SDKManifest,
>(
  _config: Config<Input, Store, Vault>,
  autoConfigs: {
    [key in keyof Manifest["dependencies"] & string]: DependencyConfig<
      Store,
      Vault,
      Input,
      any
    >
  },
) {
  return autoConfigs
}
