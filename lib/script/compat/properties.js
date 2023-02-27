"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.properties = void 0;
const dependencies_js_1 = require("../dependencies.js");
const util_js_1 = require("../util.js");
// deno-lint-ignore no-explicit-any
const asResult = (result) => ({ result: result });
const noPropertiesFound = {
    result: {
        version: 2,
        data: {
            "Not Ready": {
                type: "string",
                value: "Could not find properties. The service might still be starting",
                qr: false,
                copyable: false,
                masked: false,
                description: "Fallback Message When Properties could not be found",
            },
        },
    },
};
/**
 * Default will pull from a file (start9/stats.yaml) expected to be made on the main volume
 * Assumption: start9/stats.yaml is created by some process
 * Throws: stats.yaml isn't yaml
 * @param effects
 * @returns
 */
const properties = async (effects) => {
    if (await (0, util_js_1.exists)(effects, { path: "start9/stats.yaml", volumeId: "main" }) ===
        false) {
        return noPropertiesFound;
    }
    return await effects.readFile({
        path: "start9/stats.yaml",
        volumeId: "main",
    }).then(dependencies_js_1.YAML.parse).then(asResult);
};
exports.properties = properties;
