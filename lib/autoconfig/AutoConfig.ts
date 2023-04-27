import { AutoConfigure, DeepPartial, Effects, ExpectedExports } from "../types";
import { Utils, deepEqual, deepMerge, utils } from "../util";

export type AutoConfigFrom<WD, Input, NestedConfigs> = {
  [key in keyof NestedConfigs & string]: (options: {
    effects: Effects;
    localConfig: Input;
    remoteConfig: NestedConfigs[key];
    utils: Utils<WD>;
  }) => Promise<void | DeepPartial<NestedConfigs[key]>>;
};
export class AutoConfig<WD, Input, NestedConfigs> {
  constructor(
    readonly configs: AutoConfigFrom<WD, Input, NestedConfigs>,
    readonly path: keyof AutoConfigFrom<WD, Input, NestedConfigs>,
  ) {}

  async check(
    options: Parameters<AutoConfigure["check"]>[0],
  ): ReturnType<AutoConfigure["check"]> {
    const origConfig = JSON.parse(JSON.stringify(options.localConfig));
    const newOptions = {
      ...options,
      utils: utils<WD>(options.effects),
      localConfig: options.localConfig as Input,
      remoteConfig: options.remoteConfig as any,
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
      remoteConfig: options.remoteConfig as any,
    };
    return deepMerge(
      {},
      options.localConfig,
      await this.configs[this.path](newOptions),
    );
  }
}