"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromMapping = exports.initNoRepeat = exports.noRepeatGuard = exports.updateConfig = void 0;
const mod_js_1 = require("./mod.js");
const M = __importStar(require("../migrations.js"));
const util = __importStar(require("../util.js"));
const mod_js_2 = require("../emver-lite/mod.js");
const mod_js_3 = require("../config/mod.js");
/**
 * @param fn function making desired modifications to the config
 * @param configured whether or not the service should be considered "configured"
 * @param noRepeat (optional) supply the version and type of the migration
 * @param noFail (optional, default:false) whether or not to fail the migration if fn throws an error
 * @returns a migraion function
 */
function updateConfig(fn, configured, noRepeat, noFail = false) {
    return M.migrationFn(async (effects) => {
        await noRepeatGuard(effects, noRepeat, async () => {
            let config = util.unwrapResultType(await (0, mod_js_1.getConfig)(mod_js_3.Config.of({}))(effects)).config;
            if (config) {
                try {
                    config = await fn(config, effects);
                }
                catch (e) {
                    if (!noFail) {
                        throw e;
                    }
                    else {
                        configured = false;
                    }
                }
                util.unwrapResultType(await (0, mod_js_1.setConfig)(effects, config));
            }
        });
        return { configured };
    });
}
exports.updateConfig = updateConfig;
async function noRepeatGuard(effects, noRepeat, fn) {
    if (!noRepeat) {
        return fn();
    }
    if (!(await util.exists(effects, {
        path: "start9/migrations",
        volumeId: "main",
    }))) {
        await effects.createDir({ path: "start9/migrations", volumeId: "main" });
    }
    const migrationPath = {
        path: `start9/migrations/${noRepeat.version}.complete`,
        volumeId: "main",
    };
    if (noRepeat.type === "up") {
        if (!(await util.exists(effects, migrationPath))) {
            await fn();
            await effects.writeFile({ ...migrationPath, toWrite: "" });
        }
    }
    else if (noRepeat.type === "down") {
        if (await util.exists(effects, migrationPath)) {
            await fn();
            await effects.removeFile(migrationPath);
        }
    }
}
exports.noRepeatGuard = noRepeatGuard;
async function initNoRepeat(effects, migrations, startingVersion) {
    if (!(await util.exists(effects, {
        path: "start9/migrations",
        volumeId: "main",
    }))) {
        const starting = mod_js_2.EmVer.parse(startingVersion);
        await effects.createDir({ path: "start9/migrations", volumeId: "main" });
        for (const version in migrations) {
            const migrationVersion = mod_js_2.EmVer.parse(version);
            if (migrationVersion.lessThanOrEqual(starting)) {
                await effects.writeFile({
                    path: `start9/migrations/${version}.complete`,
                    volumeId: "main",
                    toWrite: "",
                });
            }
        }
    }
}
exports.initNoRepeat = initNoRepeat;
function fromMapping(migrations, currentVersion) {
    const inner = M.fromMapping(migrations, currentVersion);
    return async (effects, version, direction) => {
        await initNoRepeat(effects, migrations, direction === "from" ? version : currentVersion);
        return inner(effects, version, direction);
    };
}
exports.fromMapping = fromMapping;
