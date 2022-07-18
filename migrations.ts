import { types as T } from "./mod.ts";
import { EmVer } from "./emver-lite/mod.ts";
import { matches } from "./dependencies.ts";

export type MigrationFn = (effects: T.Effects) => Promise<T.MigrationRes>;

export interface Migration {
  up: MigrationFn;
  down: MigrationFn;
}

export interface MigrationMapping {
  [version: string]: Migration;
}

export function fromMapping(
  migrations: MigrationMapping,
  currentVersion: string,
): T.ExpectedExports.migration {
  const directionShape = matches.literals("from", "to");
  return async (
    effects: T.Effects,
    version: string,
    direction?: unknown,
  ) => {
    if (!directionShape.test(direction)) {
      return { error: 'Must specify arg "from" or "to".' };
    }

    let configured = true;

    const current = EmVer.parse(currentVersion);
    const other = EmVer.parse(version);

    const migrationsToRun = matches.matches(direction)
      .when("from", () =>
        Object.entries(migrations)
          .map(([version, migration]) => ({
            version: EmVer.parse(version),
            migration,
          })).filter(({ version }) =>
            version.greaterThan(other) && version.lessThanOrEqual(current)
          ).sort((a, b) => a.version.compareForSort(b.version))
          .map(({ migration }) => migration.up))
      .when("to", () =>
        Object.entries(migrations)
          .map(([version, migration]) => ({
            version: EmVer.parse(version),
            migration,
          })).filter(({ version }) =>
            version.lessThanOrEqual(other) && version.greaterThan(current)
          ).sort((a, b) => b.version.compareForSort(a.version))
          .map(({ migration }) => migration.down))
      .unwrap();

    for (const migration of migrationsToRun) {
      configured = (await migration(effects)).configured && configured;
    }

    return { result: { configured } };
  };
}
