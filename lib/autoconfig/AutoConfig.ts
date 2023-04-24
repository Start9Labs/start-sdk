import { AutoConfigure, Effects, ExpectedExports } from "../types";
import { Utils, deepEqual, deepMerge, utils } from "../util";

export type AutoConfigFrom<WD, Input> = {
  [key: string]: (options: {
    effects: Effects;
    localConfig: Input;
    remoteConfig: unknown;
    utils: Utils<WD>;
  }) => Promise<void | Record<string, unknown>>;
};
export class AutoConfig<WD, Input> {
  constructor(
    readonly configs: AutoConfigFrom<WD, Input>,
    readonly path: keyof AutoConfigFrom<WD, Input>,
  ) {}

  async check(
    options: Parameters<AutoConfigure["check"]>[0],
  ): ReturnType<AutoConfigure["check"]> {
    const origConfig = JSON.parse(JSON.stringify(options.localConfig));
    const newOptions = {
      ...options,
      utils: utils<WD>(options.effects),
      localConfig: options.localConfig as Input,
    };
    if (
      !deepEqual(
        origConfig,
        deepMerge(
          {},
          options.localConfig,
          await this.configs[this.path](newOptions),
        ),
      )
    )
      throw new Error(`Check failed for ${this.path}`);
  }
  async autoConfigure(
    options: Parameters<AutoConfigure["autoConfigure"]>[0],
  ): ReturnType<AutoConfigure["autoConfigure"]> {
    const newOptions = {
      ...options,
      utils: utils<WD>(options.effects),
      localConfig: options.localConfig as Input,
    };
    return deepMerge(
      {},
      options.localConfig,
      await this.configs[this.path](newOptions),
    );
  }
}
