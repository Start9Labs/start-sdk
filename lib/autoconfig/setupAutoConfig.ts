import { SDKManifest } from "../manifest/ManifestTypes"
import { AutoConfig, AutoConfigFrom } from "./AutoConfig"

export function setupAutoConfig<
  Store,
  Input,
  Manifest extends SDKManifest,
  NestedConfigs extends {
    [key in keyof Manifest["dependencies"]]: unknown
  },
>(configs: AutoConfigFrom<Store, Input, NestedConfigs>) {
  type C = typeof configs
  const answer = { ...configs } as unknown as {
    [k in keyof C]: AutoConfig<Store, Input, NestedConfigs>
  }
  for (const key in configs) {
    answer[key as keyof typeof configs] = new AutoConfig<
      Store,
      Input,
      NestedConfigs
    >(configs, key as keyof typeof configs)
  }
  return answer
}
