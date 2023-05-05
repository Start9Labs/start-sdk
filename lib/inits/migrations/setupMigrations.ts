import { EmVer } from "../../emverLite/mod"
import { SDKManifest } from "../../manifest/ManifestTypes"
import { ExpectedExports } from "../../types"
import { once } from "../../util/once"
import { Migration } from "./Migration"

export class Migrations<WD> {
  private constructor(
    readonly manifest: SDKManifest,
    readonly migrations: Array<Migration<any, WD>>,
  ) {}
  private sortedMigrations = once(() => {
    const migrationsAsVersions = (
      this.migrations as Array<Migration<any, WD>>
    ).map((x) => [EmVer.parse(x.options.version), x] as const)
    migrationsAsVersions.sort((a, b) => a[0].compareForSort(b[0]))
    return migrationsAsVersions
  })
  private currentVersion = once(() => EmVer.parse(this.manifest.version))
  static of<Migrations extends Array<Migration<any, WD>>, WD>(
    manifest: SDKManifest,
    ...migrations: EnsureUniqueId<Migrations, WD>
  ) {
    return new Migrations(manifest, migrations as Array<Migration<any, WD>>)
  }
  async init({
    effects,
    utils,
    previousVersion,
  }: Parameters<ExpectedExports.init<WD>>[0]) {
    if (!!previousVersion) {
      const previousVersionEmVer = EmVer.parse(previousVersion)
      for (const [_, migration] of this.sortedMigrations()
        .filter((x) => x[0].greaterThan(previousVersionEmVer))
        .filter((x) => x[0].lessThanOrEqual(this.currentVersion()))) {
        await migration.up({ effects, utils })
      }
    }
  }
  async uninit({
    effects,
    utils,
    nextVersion,
  }: Parameters<ExpectedExports.uninit<WD>>[0]) {
    if (!!nextVersion) {
      const nextVersionEmVer = EmVer.parse(nextVersion)
      const reversed = [...this.sortedMigrations()].reverse()
      for (const [_, migration] of reversed
        .filter((x) => x[0].greaterThan(nextVersionEmVer))
        .filter((x) => x[0].lessThanOrEqual(this.currentVersion()))) {
        await migration.down({ effects, utils })
      }
    }
  }
}

export function setupMigrations<
  Migrations extends Array<Migration<any, WD>>,
  WD,
>(manifest: SDKManifest, ...migrations: EnsureUniqueId<Migrations, WD>) {
  return Migrations.of(manifest, ...migrations)
}

// prettier-ignore
export type EnsureUniqueId<A, WD, B = A, ids = never> =
  B extends [] ? A : 
  B extends [Migration<infer id, WD>, ...infer Rest] ? (
    id extends ids ? "One of the ids are not unique"[] :
    EnsureUniqueId<A, Rest, id | ids>
  ) : "There exists a migration that is not a Migration"[]
