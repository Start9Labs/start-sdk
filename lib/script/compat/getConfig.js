"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigAndMatcher = exports.getConfig = void 0;
const dependencies_js_1 = require("../dependencies.js");
const dependencies_js_2 = require("../dependencies.js");
const propertiesMatcher_js_1 = require("../utils/propertiesMatcher.js");
const { any, string, dictionary } = dependencies_js_2.matches;
const matchConfig = dictionary([string, any]);
/**
 * Call with the configuration to get a standard getConfig for the expected exports
 * Assumption: start9/config.yaml is where the config will be stored
 * Throws: Error if there is no file
 * Throws: Error if the config.yaml isn't yaml nor config shape
 * @param spec
 * @returns
 */
const getConfig = (spec) => async (effects) => {
    const config = await effects
        .readFile({
        path: "start9/config.yaml",
        volumeId: "main",
    })
        .then((x) => dependencies_js_1.YAML.parse(x))
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
exports.getConfig = getConfig;
/**
 * Call with the configuration to get a standard getConfig for the expected exports
 * Assumption: start9/config.yaml is where the config will be stored
 * Throws: Error if there is no file
 * Throws: Error if the config.yaml isn't yaml nor config shape
 * @param spec
 * @returns A funnction for getConfig and the matcher for the spec sent in
 */
const getConfigAndMatcher = (spec) => {
    const specBuilt = spec.build();
    return [
        async (effects) => {
            const config = await effects
                .readFile({
                path: "start9/config.yaml",
                volumeId: "main",
            })
                .then((x) => dependencies_js_1.YAML.parse(x))
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
        (0, propertiesMatcher_js_1.typeFromProps)(specBuilt),
    ];
};
exports.getConfigAndMatcher = getConfigAndMatcher;
