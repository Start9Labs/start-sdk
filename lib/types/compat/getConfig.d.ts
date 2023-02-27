import { Config } from "../config/config.js";
import { matches } from "../dependencies.js";
import { ExpectedExports } from "../types.js";
import { ConfigSpec } from "../types/config-types.js";
import { TypeFromProps } from "../utils/propertiesMatcher.js";
/**
 * Call with the configuration to get a standard getConfig for the expected exports
 * Assumption: start9/config.yaml is where the config will be stored
 * Throws: Error if there is no file
 * Throws: Error if the config.yaml isn't yaml nor config shape
 * @param spec
 * @returns
 */
export declare const getConfig: <A extends ConfigSpec>(spec: Config<A>) => ExpectedExports.getConfig;
/**
 * Call with the configuration to get a standard getConfig for the expected exports
 * Assumption: start9/config.yaml is where the config will be stored
 * Throws: Error if there is no file
 * Throws: Error if the config.yaml isn't yaml nor config shape
 * @param spec
 * @returns A funnction for getConfig and the matcher for the spec sent in
 */
export declare const getConfigAndMatcher: <Spec extends ConfigSpec>(spec: Config<Spec>) => [ExpectedExports.getConfig, matches.Validator<unknown, TypeFromProps<Spec>>];
