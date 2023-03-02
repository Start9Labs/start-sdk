import { ok } from "../util";
import * as T from "../types";

export const DEFAULT_OPTIONS: T.BackupOptions = {
  delete: true,
  force: true,
  ignoreExisting: false,
  exclude: [],
};
type BackupSet = {
  srcPath: string;
  srcVolume: string;
  dstPath: string;
  dstVolume: string;
  options?: Partial<T.BackupOptions>;
};
/**
 * This utility simplifies the volume backup process.
 * ```ts
 * export const { createBackup, restoreBackup } = Backups.volumes("main").build();
 * ```
 *
 * Changing the options of the rsync, (ie exludes) use either
 * ```ts
 *  Backups.volumes("main").set_options({exclude: ['bigdata/']}).volumes('excludedVolume').build()
 * // or
 *  Backups.with_options({exclude: ['bigdata/']}).volumes('excludedVolume').build()
 * ```
 *
 * Using the more fine control, using the addSets for more control
 * ```ts
 * Backups.addSets({
 * srcVolume: 'main', srcPath:'smallData/', dstPath: 'main/smallData/', dstVolume: : Backups.BACKUP
 * }, {
 * srcVolume: 'main', srcPath:'bigData/', dstPath: 'main/bigData/', dstVolume: : Backups.BACKUP, options: {exclude:['bigData/excludeThis']}}
 * ).build()q
 * ```
 */
export class Backups {
  static BACKUP = "BACKUP" as const;

  constructor(
    private options = DEFAULT_OPTIONS,
    private backupSet = [] as BackupSet[]
  ) {}
  static volumes(...volumeNames: string[]) {
    return new Backups().addSets(
      ...volumeNames.map((srcVolume) => ({
        srcVolume,
        srcPath: "./",
        dstPath: `./${srcVolume}/`,
        dstVolume: Backups.BACKUP,
      }))
    );
  }
  static addSets(...options: BackupSet[]) {
    return new Backups().addSets(...options);
  }
  static with_options(options?: Partial<T.BackupOptions>) {
    return new Backups({ ...DEFAULT_OPTIONS, ...options });
  }
  set_options(options?: Partial<T.BackupOptions>) {
    this.options = {
      ...this.options,
      ...options,
    };
    return this;
  }
  volumes(...volumeNames: string[]) {
    return this.addSets(
      ...volumeNames.map((srcVolume) => ({
        srcVolume,
        srcPath: "./",
        dstPath: `./${srcVolume}/`,
        dstVolume: Backups.BACKUP,
      }))
    );
  }
  addSets(...options: BackupSet[]) {
    options.forEach((x) =>
      this.backupSet.push({ ...x, options: { ...this.options, ...x.options } })
    );
    return this;
  }
  build() {
    const createBackup: T.ExpectedExports.createBackup = async ({
      effects,
    }) => {
      const previousItems = (
        await effects
          .readDir({
            volumeId: Backups.BACKUP,
            path: ".",
          })
          .catch(() => [])
      ).map((x) => `${x}`);
      const backupPaths = this.backupSet
        .filter((x) => x.dstVolume === Backups.BACKUP)
        .map((x) => x.dstPath)
        .map((x) => x.replace(/\.\/([^]*)\//, "$1"));
      const filteredItems = previousItems.filter(
        (x) => backupPaths.indexOf(x) === -1
      );
      for (const itemToRemove of filteredItems) {
        effects.error(`Trying to remove ${itemToRemove}`);
        await effects
          .removeDir({
            volumeId: Backups.BACKUP,
            path: itemToRemove,
          })
          .catch(() =>
            effects.removeFile({
              volumeId: Backups.BACKUP,
              path: itemToRemove,
            })
          )
          .catch(() => {
            effects.warn(`Failed to remove ${itemToRemove} from backup volume`);
          });
      }
      for (const item of this.backupSet) {
        if (notEmptyPath(item.dstPath)) {
          await effects.createDir({
            volumeId: item.dstVolume,
            path: item.dstPath,
          });
        }
        await effects
          .runRsync({
            ...item,
            options: {
              ...this.options,
              ...item.options,
            },
          })
          .wait();
      }
      return ok;
    };
    const restoreBackup: T.ExpectedExports.restoreBackup = async ({
      effects,
    }) => {
      for (const item of this.backupSet) {
        if (notEmptyPath(item.srcPath)) {
          await effects.createDir({
            volumeId: item.srcVolume,
            path: item.srcPath,
          });
        }
        await effects
          .runRsync({
            options: {
              ...this.options,
              ...item.options,
            },
            srcVolume: item.dstVolume,
            dstVolume: item.srcVolume,
            srcPath: item.dstPath,
            dstPath: item.srcPath,
          })
          .wait();
      }
      return ok;
    };
    return { createBackup, restoreBackup };
  }
}
function notEmptyPath(file: string) {
  return ["", ".", "./"].indexOf(file) === -1;
}
