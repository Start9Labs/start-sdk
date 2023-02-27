import { types as T } from "./mod.js";
export type MigrationFn<version extends string, type extends "up" | "down"> = (effects: T.Effects) => Promise<T.MigrationRes> & {
    _type: type;
    _version: version;
};
export declare function migrationFn<version extends string, type extends "up" | "down">(fn: (effects: T.Effects) => Promise<T.MigrationRes>): MigrationFn<version, type>;
export interface Migration<version extends string> {
    up: MigrationFn<version, "up">;
    down: MigrationFn<version, "down">;
}
export type MigrationMapping<versions extends string> = {
    [version in versions]: Migration<version>;
};
export declare function fromMapping<versions extends string>(migrations: MigrationMapping<versions>, currentVersion: string): T.ExpectedExports.migration;
