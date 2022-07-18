import { types as T } from "./mod.ts";
import { EmVer } from "./emver-lite/mod.ts";

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
  return async (effects: T.Effects, version: string) => {
    let configured = true;

    const current = EmVer.parse(currentVersion);
    const previous = EmVer.parse(version);

    let migrationsToRun: MigrationFn[];
    switch (previous.compare(current)) {
      case 0:
        migrationsToRun = [];
        break;
      case 1: // ups
        migrationsToRun = Object.entries(migrations).map(
          ([version, migration]) => ({
            version: EmVer.parse(version),
            migration,
          }),
        ).filter(({ version }) => version.greaterThan(previous)).sort((a, b) =>
          a.version.compare(b.version)
        ).map(({ migration }) => migration.up);
        break;
      case -1: // downs
        migrationsToRun = Object.entries(migrations).map(
          ([version, migration]) => ({
            version: EmVer.parse(version),
            migration,
          }),
        ).filter(({ version }) => version.lessThanOrEqual(previous)).sort((
          a,
          b,
        ) => b.version.compare(a.version)).map(({ migration }) =>
          migration.down
        );
        break;
      default:
        return { error: "unreachable" };
    }

    for (const migration of migrationsToRun) {
      configured = (await migration(effects)).configured && configured;
    }

    return { result: { configured } };
  };
}
