import { GenericManifest } from "../manifest/ManifestTypes";
import { AutoConfig, AutoConfigFrom } from "./AutoConfig";

export function setupAutoConfig<
  WD,
  Input,
  Manifest extends GenericManifest,
  NestedConfigs extends {
    [key in keyof Manifest["dependencies"]]: unknown;
  },
>(configs: AutoConfigFrom<WD, Input, NestedConfigs>) {
  type C = typeof configs;
  const answer = { ...configs } as unknown as {
    [k in keyof C]: AutoConfig<WD, Input, NestedConfigs>;
  };
  for (const key in configs) {
    answer[key as keyof typeof configs] = new AutoConfig<
      WD,
      Input,
      NestedConfigs
    >(configs, key as keyof typeof configs);
  }
  return answer;
}
