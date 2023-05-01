import { string } from "ts-matches"
import { Backups } from "."
import { GenericManifest } from "../manifest/ManifestTypes"
import { BackupOptions, ExpectedExports } from "../types"
import { _ } from "../util"

export type SetupBackupsParams<M extends GenericManifest> = Array<
  (keyof M["volumes"] & string) | Backups<M>
>

export function setupBackups<M extends GenericManifest>(
  ...args: _<SetupBackupsParams<M>>
) {
  const backups = Array<Backups<M>>()
  const volumes = new Set<keyof M["volumes"] & string>()
  for (const arg of args) {
    if (arg instanceof Backups) {
      backups.push(arg)
    } else {
      volumes.add(arg)
    }
  }
  backups.push(Backups.volumes(...volumes))
  return {
    get createBackup() {
      return (async (options) => {
        for (const backup of backups) {
          await backup.build().createBackup(options)
        }
      }) as ExpectedExports.createBackup
    },
    get restoreBackup() {
      return (async (options) => {
        for (const backup of backups) {
          await backup.build().restoreBackup(options)
        }
      }) as ExpectedExports.restoreBackup
    },
  } satisfies {
    createBackup: ExpectedExports.createBackup
    restoreBackup: ExpectedExports.restoreBackup
  }
}
