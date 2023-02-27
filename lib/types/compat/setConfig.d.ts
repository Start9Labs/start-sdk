import { DependsOn, Effects, SetResult } from "../types.js";
import { ConfigSpec } from "../types/config-types.js";
/**
 * Will set the config to the default start9/config.yaml
 * Assumption: start9/config.yaml is the location of the configuration
 * @param effects
 * @param newConfig Config to be written to start9/config.yaml
 * @param depends_on This would be the depends on for condition depends_on
 * @returns
 */
export declare const setConfig: (effects: Effects, newConfig: ConfigSpec, dependsOn?: DependsOn) => Promise<{
    result: SetResult;
}>;
