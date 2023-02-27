import { YAML } from "../dependencies.js";
import { DependsOn, Effects, ExpectedExports, SetResult } from "../types.js";
import { ConfigSpec } from "../types/config-types.js";

/**
 * Will set the config to the default start9/config.yaml
 * Assumption: start9/config.yaml is the location of the configuration
 * @param effects
 * @param newConfig Config to be written to start9/config.yaml
 * @param depends_on This would be the depends on for condition depends_on
 * @returns
 */
export const setConfig = async (
  effects: Effects,
  newConfig: ConfigSpec,
  dependsOn: DependsOn = {},
) => {
  await effects.createDir({
    path: "start9",
    volumeId: "main",
  });
  await effects.writeFile({
    path: "start9/config.yaml",
    toWrite: YAML.stringify(newConfig),
    volumeId: "main",
  });

  const result: SetResult = {
    signal: "SIGTERM",
    "depends-on": dependsOn,
  };
  return { result };
};

const _typeConversionCheck: ExpectedExports.setConfig = setConfig;
