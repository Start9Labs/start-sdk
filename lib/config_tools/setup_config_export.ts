import { Config } from "../config_builder/mod";
import { DependsOn, Effects, ExpectedExports } from "../types";
import { ConfigSpec } from "../types/config-types";
import { okOf } from "../util";
import { TypeFromProps } from "../utils/propertiesMatcher";
import { nullIfEmpty } from "./mod";

export function setupConfigExports<A extends ConfigSpec>(options: {
  spec: Config<A>;
  dependsOn: DependsOn;
  write(effects: Effects, config: TypeFromProps<A>): Promise<null>;
  read(
    effects: Effects
  ): Promise<Record<string | number, never> | TypeFromProps<A>>;
}) {
  const validator = options.spec.validator();
  return {
    setConfig: (async ({ effects, input: config }) => {
      if (!validator.test(config)) {
        await effects.error(String(validator.errorMessage(config)));
        return { error: "Set config type error for config" };
      }
      await options.write(effects, config);
      return okOf({
        signal: "SIGTERM",
        "depends-on": options.dependsOn,
      });
    }) as ExpectedExports.setConfig,
    getConfig: (async ({ effects }) => {
      return okOf({
        spec: options.spec.build(),
        config: nullIfEmpty(await options.read(effects)),
      });
    }) as ExpectedExports.getConfig,
  };
}
