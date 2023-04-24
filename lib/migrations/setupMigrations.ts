import { setupActions } from "../actions/setupActions";
import { EmVer } from "../emverLite/mod";
import { GenericManifest } from "../manifest/ManifestTypes";
import { ExpectedExports } from "../types";
import { once } from "../util/once";
import { Migration } from "./Migration";

export function setupMigrations<Migrations extends Array<Migration<any>>>(
  manifest: GenericManifest,
  initializeActions: ReturnType<typeof setupActions>["initializeActions"],
  ...migrations: EnsureUniqueId<Migrations>
) {
  const sortedMigrations = once(() => {
    const migrationsAsVersions = (migrations as Array<Migration<any>>).map(
      (x) => [EmVer.parse(x.options.version), x] as const,
    );
    migrationsAsVersions.sort((a, b) => a[0].compareForSort(b[0]));
    return migrationsAsVersions;
  });
  const currentVersion = once(() => EmVer.parse(manifest.version));
  const init: ExpectedExports.init = async ({ effects, previousVersion }) => {
    await initializeActions(effects);
    if (!!previousVersion) {
      const previousVersionEmVer = EmVer.parse(previousVersion);
      for (const [_, migration] of sortedMigrations()
        .filter((x) => x[0].greaterThan(previousVersionEmVer))
        .filter((x) => x[0].lessThanOrEqual(currentVersion()))) {
        await migration.up({ effects });
      }
    }
  };
  const uninit: ExpectedExports.uninit = async ({ effects, nextVersion }) => {
    if (!!nextVersion) {
      const nextVersionEmVer = EmVer.parse(nextVersion);
      const reversed = [...sortedMigrations()].reverse();
      for (const [_, migration] of reversed
        .filter((x) => x[0].greaterThan(nextVersionEmVer))
        .filter((x) => x[0].lessThanOrEqual(currentVersion()))) {
        await migration.down({ effects });
      }
    }
  };
  return { init, uninit };
}

// prettier-ignore
export type EnsureUniqueId<A, B = A, ids = never> =
  B extends [] ? A : 
  B extends [Migration<infer id>, ...infer Rest] ? (
    id extends ids ? "One of the ids are not unique"[] :
    EnsureUniqueId<A, Rest, id | ids>
  ) : "There exists a migration that is not a Migration"[]
