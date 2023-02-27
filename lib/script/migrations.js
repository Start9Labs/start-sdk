"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromMapping = exports.migrationFn = void 0;
const mod_js_1 = require("./emver-lite/mod.js");
const dependencies_js_1 = require("./dependencies.js");
function migrationFn(fn) {
    return fn;
}
exports.migrationFn = migrationFn;
function fromMapping(migrations, currentVersion) {
    const directionShape = dependencies_js_1.matches.literals("from", "to");
    return async (effects, version, direction) => {
        if (!directionShape.test(direction)) {
            return { error: 'Must specify arg "from" or "to".' };
        }
        let configured = true;
        const current = mod_js_1.EmVer.parse(currentVersion);
        const other = mod_js_1.EmVer.parse(version);
        const filteredMigrations = Object.entries(migrations)
            .map(([version, migration]) => ({
            version: mod_js_1.EmVer.parse(version),
            migration,
        })).filter(({ version }) => version.greaterThan(other) && version.lessThanOrEqual(current));
        const migrationsToRun = dependencies_js_1.matches.matches(direction)
            .when("from", () => filteredMigrations
            .sort((a, b) => a.version.compareForSort(b.version)) // low to high
            .map(({ migration }) => migration.up))
            .when("to", () => filteredMigrations
            .sort((a, b) => b.version.compareForSort(a.version)) // high to low
            .map(({ migration }) => migration.down))
            .unwrap();
        for (const migration of migrationsToRun) {
            configured = (await migration(effects)).configured && configured;
        }
        return { result: { configured } };
    };
}
exports.fromMapping = fromMapping;
