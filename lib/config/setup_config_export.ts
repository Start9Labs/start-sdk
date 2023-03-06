import { Config } from "./builder";
import { DeepPartial, DependsOn, Effects, ExpectedExports } from "../types";
import { InputSpec } from "../types/config-types";
import { nullIfEmpty } from "../util";
import { TypeFromProps } from "../util/propertiesMatcher";

/**
 * We want to setup a config export with a get and set, this
 * is going to be the default helper to setup config, because it will help
 * enforce that we have a spec, write, and reading.
 * @param options
 * @returns
 */
export function setupConfigExports<A extends InputSpec>(options: {
  spec: Config<A>;
  dependsOn: DependsOn;
  write(effects: Effects, config: TypeFromProps<A>): Promise<void>;
  read(effects: Effects): Promise<null | DeepPartial<TypeFromProps<A>>>;
}) {
  const validator = options.spec.validator();
  return {
    setConfig: (async ({ effects, input: config }) => {
      if (!validator.test(config)) {
        await effects.error(String(validator.errorMessage(config)));
        return { error: "Set config type error for config" };
      }
      await options.write(effects, config);
      return {
        signal: "SIGTERM",
        "depends-on": options.dependsOn,
      };
    }) as ExpectedExports.setConfig,
    getConfig: (async ({ effects }) => {
      return {
        spec: options.spec.build(),
        config: nullIfEmpty(await options.read(effects)),
      };
    }) as ExpectedExports.getConfig,
  };
}

export default setupConfigExports;
