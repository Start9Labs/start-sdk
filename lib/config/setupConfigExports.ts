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

export type Write<A> = (options: {
  effects: Effects;
  input: TypeFromProps<A>;
}) => Promise<void>;
export type Read<A> = (options: {
  effects: Effects;
}) => Promise<null | DeepPartial<TypeFromProps<A>>>;
export type DependenciesFn<A> = (options: {
  effects: Effects;
  input: TypeFromProps<A>;
}) => Promise<Dependencies | void>;
/**
 * We want to setup a config export with a get and set, this
 * is going to be the default helper to setup config, because it will help
 * enforce that we have a spec, write, and reading.
 * @param options
 * @returns
 */
export function setupConfigExports<A extends InputSpec>(
  spec: Config<A>,
  write: Write<A>,
  read: Read<A>,
  dependencies: DependenciesFn<A>,
) {
  const validator = spec.validator();
  return {
    setConfig: (async ({ effects, input }) => {
      if (!validator.test(input)) {
        await effects.error(String(validator.errorMessage(input)));
        return { error: "Set config type error for config" };
      }
      await write({
        input: JSON.parse(JSON.stringify(input)),
        effects,
      });
      const dependenciesToSet = (await dependencies({ effects, input })) || [];
      await effects.setDependencies(dependenciesToSet);
    }) as ExpectedExports.setConfig,
    getConfig: (async ({ effects, config }) => {
      return {
        spec: spec.build(),
        config: nullIfEmpty(await read({ effects })),
      };
    }) as ExpectedExports.getConfig,
  };
}

export default setupConfigExports;
