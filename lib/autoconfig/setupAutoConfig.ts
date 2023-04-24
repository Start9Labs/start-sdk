import { AutoConfig, AutoConfigFrom } from "./AutoConfig";

export function setupAutoConfig<WD, Input>(configs: AutoConfigFrom<WD, Input>) {
  type C = typeof configs;
  const answer = { ...configs } as unknown as {
    [k in keyof C]: AutoConfig<WD, Input>;
  };
  for (const key in configs) {
    answer[key] = new AutoConfig<WD, Input>(configs, key);
  }
  return answer;
}
