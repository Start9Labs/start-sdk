import * as T from "../types.js";
import * as M from "../migrations.js";
import { ConfigSpec } from "../types/config-types.js";
export interface NoRepeat<version extends string, type extends "up" | "down"> {
    version: version;
    type: type;
}
/**
 * @param fn function making desired modifications to the config
 * @param configured whether or not the service should be considered "configured"
 * @param noRepeat (optional) supply the version and type of the migration
 * @param noFail (optional, default:false) whether or not to fail the migration if fn throws an error
 * @returns a migraion function
 */
export declare function updateConfig<version extends string, type extends "up" | "down">(fn: (config: ConfigSpec, effects: T.Effects) => ConfigSpec | Promise<ConfigSpec>, configured: boolean, noRepeat?: NoRepeat<version, type>, noFail?: boolean): M.MigrationFn<version, type>;
export declare function noRepeatGuard<version extends string, type extends "up" | "down">(effects: T.Effects, noRepeat: NoRepeat<version, type> | undefined, fn: () => Promise<void>): Promise<void>;
export declare function initNoRepeat<versions extends string>(effects: T.Effects, migrations: M.MigrationMapping<versions>, startingVersion: string): Promise<void>;
export declare function fromMapping<versions extends string>(migrations: M.MigrationMapping<versions>, currentVersion: string): T.ExpectedExports.migration;
