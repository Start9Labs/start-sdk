import { YAML } from "../dependencies.ts";
import { ExpectedExports, Effects, Config, SetResult, DependsOn } from "../types.ts";

/**
 * Will set the config to the default start9/config.yaml
 * @param effects 
 * @param newConfig Config to be written to start9/config.yaml
 * @param depends_on This would be the depends on for condition depends_on
 * @returns 
 */
export const setConfig: ExpectedExports.setConfig = async (
    effects: Effects,
    newConfig: Config,
    dependsOn: DependsOn = {}
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
    return { result, };
};
