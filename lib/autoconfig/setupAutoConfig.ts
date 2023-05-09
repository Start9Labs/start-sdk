import { Config } from "../config/builder/config"
import { SDKManifest } from "../manifest/ManifestTypes"
import { AutoConfig, AutoConfigFrom } from "./AutoConfig"

export function setupAutoConfig<
  Store,
  Vault,
  Input extends Record<string, any>,
  Manifest extends SDKManifest,
  NestedConfigs extends {
    [key in keyof Manifest["dependencies"]]: unknown
  },
>(
  _config: Config<Input, Store, Vault>,
  autoConfigs: AutoConfigFrom<Store, Vault, Input, NestedConfigs>,
) {
  type C = typeof autoConfigs
  const answer = { ...autoConfigs } as unknown as {
    [k in keyof C]: AutoConfig<Store, Vault, Input, NestedConfigs>
  }
  for (const key in autoConfigs) {
    answer[key as keyof typeof autoConfigs] = new AutoConfig<
      Store,
      Vault,
      Input,
      NestedConfigs
    >(autoConfigs, key as keyof typeof autoConfigs)
  }
  return answer
}
