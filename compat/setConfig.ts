import { YAML } from "../dependencies.ts";
import { DependsOn, Effects, ExpectedExports } from "../types.ts";
import { okOf } from "../util.ts";

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
  newConfig: Record<string, unknown>,
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

  return okOf(
    {
      signal: "SIGTERM",
      "depends-on": dependsOn,
    } as const,
  );
};

const _typeConversionCheck: ExpectedExports.setConfig = setConfig;
