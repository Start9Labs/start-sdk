import { Config } from "../config/builder/config"
import { SDKManifest } from "../manifest/ManifestTypes"
import { AutoConfig } from "./AutoConfig"

export function setupAutoConfig<
  Store,
  Vault,
  Input extends Record<string, any>,
  Manifest extends SDKManifest,
>(
  _config: Config<Input, Store, Vault>,
  autoConfigs: {
    [key in keyof Manifest["dependencies"] & string]: AutoConfig<
      Store,
      Vault,
      Input,
      any
    >
  },
) {
  return autoConfigs
}
