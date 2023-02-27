import { EmVer } from "./emver-lite/mod.js";
import { matches } from "./dependencies.js";
export function migrationFn(fn) {
    return fn;
}
export function fromMapping(migrations, currentVersion) {
    const directionShape = matches.literals("from", "to");
    return async (effects, version, direction) => {
        if (!directionShape.test(direction)) {
            return { error: 'Must specify arg "from" or "to".' };
        }
        let configured = true;
        const current = EmVer.parse(currentVersion);
        const other = EmVer.parse(version);
        const filteredMigrations = Object.entries(migrations)
            .map(([version, migration]) => ({
            version: EmVer.parse(version),
            migration,
        })).filter(({ version }) => version.greaterThan(other) && version.lessThanOrEqual(current));
        const migrationsToRun = matches.matches(direction)
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
