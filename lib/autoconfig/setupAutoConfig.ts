import { AutoConfig, AutoConfigFrom } from "./AutoConfig";

export function setupAutoConfig<C extends AutoConfigFrom>(configs: C) {
  const answer = { ...configs } as unknown as { [k in keyof C]: AutoConfig };
  for (const key in configs) {
    answer[key] = new AutoConfig(configs, key);
  }
  return answer;
}
