import { types as T } from "./mod.ts";
import { EmVer } from "./emver-lite/mod.ts";
import { matches } from "./dependencies.ts";

export type MigrationFn<version extends string, type extends "up" | "down"> = (
  effects: T.Effects,
) => Promise<T.MigrationRes> & { _type: type; _version: version };

export function migrationFn<version extends string, type extends "up" | "down">(
  fn: (
    effects: T.Effects,
  ) => Promise<T.MigrationRes>,
): MigrationFn<version, type> {
  return fn as MigrationFn<version, type>;
}

export interface Migration<version extends string> {
  up: MigrationFn<version, "up">;
  down: MigrationFn<version, "down">;
}

export type MigrationMapping<versions extends string> = {
  [version in versions]: Migration<version>;
};

export function fromMapping<versions extends string>(
  migrations: MigrationMapping<versions>,
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

    const filteredMigrations = (Object.entries(migrations) as [
      keyof MigrationMapping<string>,
      Migration<string>,
    ][])
      .map(([version, migration]) => ({
        version: EmVer.parse(version),
        migration,
      })).filter(({ version }) =>
        version.greaterThan(other) && version.lessThanOrEqual(current)
      );

    const migrationsToRun = matches.matches(direction)
      .when("from", () =>
        filteredMigrations
          .sort((a, b) => a.version.compareForSort(b.version)) // low to high
          .map(({ migration }) => migration.up))
      .when("to", () =>
        filteredMigrations
          .sort((a, b) => b.version.compareForSort(a.version)) // high to low
          .map(({ migration }) => migration.down))
      .unwrap();

    for (const migration of migrationsToRun) {
      configured = (await migration(effects)).configured && configured;
    }

    return { result: { configured } };
  };
}
