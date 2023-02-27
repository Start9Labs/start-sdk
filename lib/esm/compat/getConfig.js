import { YAML } from "../dependencies.js";
import { matches } from "../dependencies.js";
import { typeFromProps } from "../utils/propertiesMatcher.js";
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
export const getConfig = (spec) => async (effects) => {
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
            spec: spec.build(),
        },
    };
};
/**
 * Call with the configuration to get a standard getConfig for the expected exports
 * Assumption: start9/config.yaml is where the config will be stored
 * Throws: Error if there is no file
 * Throws: Error if the config.yaml isn't yaml nor config shape
 * @param spec
 * @returns A funnction for getConfig and the matcher for the spec sent in
 */
export const getConfigAndMatcher = (spec) => {
    const specBuilt = spec.build();
    return [
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
                    spec: specBuilt,
                },
            };
        },
        typeFromProps(specBuilt),
    ];
};
