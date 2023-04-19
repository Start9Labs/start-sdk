import { AutoConfigure, Effects, ExpectedExports } from "../types";
import { deepEqual, deepMerge } from "../util";

export type AutoConfigFrom = {
  [key: string]: (options: {
    effects: Effects;
    localConfig: unknown;
    remoteConfig: unknown;
  }) => Promise<void | Record<string, unknown>>;
};
export class AutoConfig {
  constructor(
    readonly configs: AutoConfigFrom,
    readonly path: keyof AutoConfigFrom,
  ) {}

  async check(
    options: Parameters<AutoConfigure["check"]>[0],
  ): ReturnType<AutoConfigure["check"]> {
    const origConfig = JSON.parse(JSON.stringify(options.localConfig));
    if (
      !deepEqual(
        origConfig,
        deepMerge(
          {},
          options.localConfig,
          await this.configs[this.path](options),
        ),
      )
    )
      throw new Error(`Check failed for ${this.path}`);
  }
  async autoConfigure(
    options: Parameters<AutoConfigure["autoConfigure"]>[0],
  ): ReturnType<AutoConfigure["autoConfigure"]> {
    return deepMerge(
      {},
      options.localConfig,
      await this.configs[this.path](options),
    );
  }
}
