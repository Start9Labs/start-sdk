import { SDKManifest } from "../manifest/ManifestTypes"
import { WrapperDataContract } from "../wrapperData/wrapperDataContract"
import { AutoConfig, AutoConfigFrom } from "./AutoConfig"

export function setupAutoConfig<
  WD,
  Input,
  Manifest extends SDKManifest,
  NestedConfigs extends {
    [key in keyof Manifest["dependencies"]]: unknown
  },
>(
  wrapperDataContract: WrapperDataContract<WD>,
  configs: AutoConfigFrom<WD, Input, NestedConfigs>,
) {
  type C = typeof configs
  const answer = { ...configs } as unknown as {
    [k in keyof C]: AutoConfig<WD, Input, NestedConfigs>
  }
  for (const key in configs) {
    answer[key as keyof typeof configs] = new AutoConfig<
      WD,
      Input,
      NestedConfigs
    >(wrapperDataContract, configs, key as keyof typeof configs)
  }
  return answer
}
