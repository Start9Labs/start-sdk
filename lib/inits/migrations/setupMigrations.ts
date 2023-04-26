import { setupActions } from "../../actions/setupActions";
import { EmVer } from "../../emverLite/mod";
import { GenericManifest } from "../../manifest/ManifestTypes";
import { ExpectedExports } from "../../types";
import { once } from "../../util/once";
import { Migration } from "./Migration";

export class Migrations {
  private constructor(
    readonly manifest: GenericManifest,
    readonly migrations: Array<Migration<any>>,
  ) {}
  private sortedMigrations = once(() => {
    const migrationsAsVersions = (this.migrations as Array<Migration<any>>).map(
      (x) => [EmVer.parse(x.options.version), x] as const,
    );
    migrationsAsVersions.sort((a, b) => a[0].compareForSort(b[0]));
    return migrationsAsVersions;
  });
  private currentVersion = once(() => EmVer.parse(this.manifest.version));
  static of<Migrations extends Array<Migration<any>>>(
    manifest: GenericManifest,
    ...migrations: EnsureUniqueId<Migrations>
  ) {
    return new Migrations(manifest, migrations as Array<Migration<any>>);
  }
  async init({
    effects,
    previousVersion,
  }: Parameters<ExpectedExports.init>[0]) {
    if (!!previousVersion) {
      const previousVersionEmVer = EmVer.parse(previousVersion);
      for (const [_, migration] of this.sortedMigrations()
        .filter((x) => x[0].greaterThan(previousVersionEmVer))
        .filter((x) => x[0].lessThanOrEqual(this.currentVersion()))) {
        await migration.up({ effects });
      }
    }
  }
  async uninit({
    effects,
    nextVersion,
  }: Parameters<ExpectedExports.uninit>[0]) {
    if (!!nextVersion) {
      const nextVersionEmVer = EmVer.parse(nextVersion);
      const reversed = [...this.sortedMigrations()].reverse();
      for (const [_, migration] of reversed
        .filter((x) => x[0].greaterThan(nextVersionEmVer))
        .filter((x) => x[0].lessThanOrEqual(this.currentVersion()))) {
        await migration.down({ effects });
      }
    }
  }
}

export function setupMigrations<Migrations extends Array<Migration<any>>>(
  manifest: GenericManifest,
  ...migrations: EnsureUniqueId<Migrations>
) {
  return Migrations.of(manifest, ...migrations);
}

// prettier-ignore
export type EnsureUniqueId<A, B = A, ids = never> =
  B extends [] ? A : 
  B extends [Migration<infer id>, ...infer Rest] ? (
    id extends ids ? "One of the ids are not unique"[] :
    EnsureUniqueId<A, Rest, id | ids>
  ) : "There exists a migration that is not a Migration"[]
