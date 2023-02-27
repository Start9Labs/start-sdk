import { YAML } from "../dependencies.js";
/**
 * Will set the config to the default start9/config.yaml
 * Assumption: start9/config.yaml is the location of the configuration
 * @param effects
 * @param newConfig Config to be written to start9/config.yaml
 * @param depends_on This would be the depends on for condition depends_on
 * @returns
 */
export const setConfig = async (effects, newConfig, dependsOn = {}) => {
    await effects.createDir({
        path: "start9",
        volumeId: "main",
    });
    await effects.writeFile({
        path: "start9/config.yaml",
        toWrite: YAML.stringify(newConfig),
        volumeId: "main",
    });
    const result = {
        signal: "SIGTERM",
        "depends-on": dependsOn,
    };
    return { result };
};
const _typeConversionCheck = setConfig;
