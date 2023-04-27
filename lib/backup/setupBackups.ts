import { string } from "ts-matches"
import { Backups } from "."
import { GenericManifest } from "../manifest/ManifestTypes"
import { BackupOptions } from "../types"
import { _ } from "../util"

export type SetupBackupsParams<M extends GenericManifest> = Array<
  keyof M["volumes"] & string
>

export function setupBackups<M extends GenericManifest>(
  ...args: _<SetupBackupsParams<M>>
) {
  return Backups.volumes(...args).build()
}

export function setupBackupsOptions<M extends GenericManifest>(
  options: Partial<BackupOptions>,
  ...args: _<SetupBackupsParams<M>>
) {
  return Backups.with_options(options)
    .volumes(...args)
    .build()
}
