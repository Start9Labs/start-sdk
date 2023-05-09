import { Config } from "../config/builder/config"
import { SDKManifest } from "../manifest/ManifestTypes"
import { AutoConfig, AutoConfigFrom } from "./AutoConfig"

export function setupAutoConfig<
  Store,
  Input extends Record<string, any>,
  Manifest extends SDKManifest,
  NestedConfigs extends {
    [key in keyof Manifest["dependencies"]]: unknown
  },
>(
  config: Config<Input, Store>,
  autoConfigs: AutoConfigFrom<Store, Input, NestedConfigs>,
) {
  type C = typeof autoConfigs
  const answer = { ...autoConfigs } as unknown as {
    [k in keyof C]: AutoConfig<Store, Input, NestedConfigs>
  }
  for (const key in autoConfigs) {
    answer[key as keyof typeof autoConfigs] = new AutoConfig<
      Store,
      Input,
      NestedConfigs
    >(autoConfigs, key as keyof typeof autoConfigs)
  }
  return answer
}
