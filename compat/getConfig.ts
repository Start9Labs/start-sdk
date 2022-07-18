import { YAML } from "../dependencies.ts";
import { matches } from "../dependencies.ts";
import { ExpectedExports } from "../types.ts";
import { ConfigSpec } from "../types.ts";

const { any, string, dictionary } = matches;

const matchConfig = dictionary([string, any]);

/**
 * Call with the configuration to get a standard getConfig for the expected exports
 * Assumption: start9/config.yaml is where the config will be stored
 * Throws: Error if there is no file
 * Throws: Error if the config.yaml isn't yaml nor config shape 
 * @param spec
 * @returns
 */
export const getConfig = (spec: ConfigSpec): ExpectedExports.getConfig =>
  async (effects) => {
    const config = await effects
      .readFile({
        path: "start9/config.yaml",
        volumeId: "main",
      })
      .then((x) => YAML.parse(x))
      .then((x) => matchConfig.unsafeCast(x))
      .catch((e) => {
        effects.info(`Got error ${e} while trying to read the config`);
        return undefined;
      });
    return {
      result: {
        config,
        spec,
      },
    };
  };
