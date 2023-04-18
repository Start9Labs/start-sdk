import { Config } from "./builder";
import {
  DeepPartial,
  Dependencies,
  DependsOn,
  Effects,
  ExpectedExports,
} from "../types";
import { InputSpec } from "./configTypes";
import { nullIfEmpty } from "../util";
import { TypeFromProps } from "../util/propertiesMatcher";

/**
 * We want to setup a config export with a get and set, this
 * is going to be the default helper to setup config, because it will help
 * enforce that we have a spec, write, and reading.
 * @param options
 * @returns
 */
export function setupConfigExports<A extends InputSpec, ConfigType>(options: {
  spec: Config<A>;
  write(options: {
    effects: Effects;
    input: TypeFromProps<A>;
  }): Promise<ConfigType>;
  read(options: {
    effects: Effects;
    config: ConfigType;
  }): Promise<null | DeepPartial<TypeFromProps<A>>>;

  dependencies(options: {
    effects: Effects;
    input: TypeFromProps<A>;
    config: ConfigType;
  }): Promise<Dependencies | void>;
}) {
  const validator = options.spec.validator();
  return {
    setConfig: (async ({ effects, input }) => {
      if (!validator.test(input)) {
        await effects.error(String(validator.errorMessage(input)));
        return { error: "Set config type error for config" };
      }
      const config = await options.write({
        input: JSON.parse(JSON.stringify(input)),
        effects,
      });
      const dependencies =
        (await options.dependencies({ effects, input, config })) || [];
      await effects.setDependencies(dependencies);
      await effects.setWrapperData({ path: "config", value: config || null });
    }) as ExpectedExports.setConfig,
    getConfig: (async ({ effects, config }) => {
      return {
        spec: options.spec.build(),
        config: nullIfEmpty(
          await options.read({ effects, config: config as ConfigType })
        ),
      };
    }) as ExpectedExports.getConfig,
  };
}

export default setupConfigExports;
