import { ok } from "./util.ts";
import * as T from "./types.ts";

/** 
 * This utility simplifies the volume backup process.
 * ```ts
 * export const { createBackup, restoreBackup } = Backups.volumes("main").build();
 * ```
*/
export class Backups {
  static BACKUP = "BACKUP" as const;
  public backupSet = [] as {
    srcPath: string;
    srcVolume: string;
    dstPath: string;
    dstVolume: string;
  }[];
  constructor() {
  }
  static volumes(...volumeNames: string[]) {
    return new Backups().addSets(...volumeNames.map((srcVolume) => ({
      srcVolume,
      srcPath: "./",
      dstPath: `./${srcVolume}/`,
      dstVolume: Backups.BACKUP,
    })));
  }
  static addSets(
    ...options: {
      srcPath: string;
      srcVolume: string;
      dstPath: string;
      dstVolume: string;
    }[]
  ) {
    return new Backups().addSets(...options);
  }
  addSets(
    ...options: {
      srcPath: string;
      srcVolume: string;
      dstPath: string;
      dstVolume: string;
    }[]
  ) {
    options.forEach((x) => this.backupSet.push(x));
    return this;
  }
  build() {
    const createBackup: T.ExpectedExports.createBackup = async (effects) => {
      for (const item of this.backupSet) {
        if (notEmptyPath(item.dstPath)) {
          await effects.createDir({
            volumeId: item.dstVolume,
            path: item.dstPath,
          });
        }
        await effects.runRsync({
          ...item,
          options: {
            delete: true,
            force: true,
            ignoreExisting: false,
            exclude: [],
          },
        }).wait();
      }
      return ok;
    };
    const restoreBackup: T.ExpectedExports.restoreBackup = async (effects) => {
      for (const item of this.backupSet) {
        if (notEmptyPath(item.srcPath)) {
          await effects.createDir({
            volumeId: item.srcVolume,
            path: item.srcPath,
          });
        }
        await effects.runRsync({
          options: {
            delete: true,
            force: true,
            ignoreExisting: false,
            exclude: [],
          },
          srcVolume: item.dstVolume,
          dstVolume: item.srcVolume,
          srcPath: item.dstPath,
          dstPath: item.srcPath,
        }).wait();
      }
      return ok;
    };
    return { createBackup, restoreBackup };
  }
}
function notEmptyPath(file: string) {
  return ["", ".", "./"].indexOf(file) === -1;
}
