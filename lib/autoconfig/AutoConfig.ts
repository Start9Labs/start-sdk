import deepmerge from "deepmerge";
import { AutoConfigure, Effects } from "../types";
import { Message, MaybePromise, ReadonlyDeep } from ".";

class AutoConfigBuilt<Config> implements AutoConfigure<Config> {
  constructor(private autoConfig: AutoConfig<Config>) {}

  async check(effects: Effects, config: Config): Promise<void> {
    for (const [message, configure] of this.autoConfig.getConfigures()) {
      const value = await configure({ effects, config });
      if (value !== null) {
        throw new Error(message);
      }
    }
  }
  /** This is called after we know that the dependency package needs a new configuration, this would be a transform for defaults */
  async autoConfigure(effects: Effects, config: Config): Promise<Config> {
    const input = { effects, config };
    const newOverwrites = (
      await Promise.all(this.autoConfig.getConfigures().map((x) => x[1](input)))
    ).filter((x): x is NonNullable<typeof x> => x !== null);
    return deepmerge.all([config, ...newOverwrites]);
  }
}
export class AutoConfig<Config> {
  private constructor(
    private configures: Array<
      [
        Message,
        (
          options: Readonly<{ config: Config; effects: Effects }>
        ) => MaybePromise<null | Partial<Config>>
      ]
    >
  ) {}
  getConfigures(): ReadonlyDeep<
    Array<
      [
        Message,
        (
          options: Readonly<{ config: Config; effects: Effects }>
        ) => MaybePromise<null | Partial<Config>>
      ]
    >
  > {
    return this.configures;
  }

  static autoConfig<Config>(
    message: Message,
    configure: (
      options: Readonly<{ config: Config; effects: Effects }>
    ) => MaybePromise<null | Partial<Config>>
  ): AutoConfig<Config> {
    return new AutoConfig([[message, configure]]);
  }
  autoConfig(
    message: Message,
    configure: (
      options: Readonly<{ config: Config; effects: Effects }>
    ) => MaybePromise<null | Partial<Config>>
  ): AutoConfig<Config> {
    this.configures.push([message, configure]);
    return this;
  }

  build() {
    return new AutoConfigBuilt(this);
  }
}
