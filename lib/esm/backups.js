import { ok } from "./util.js";
export const DEFAULT_OPTIONS = {
    delete: true,
    force: true,
    ignoreExisting: false,
    exclude: [],
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
 * ).build()
 * ```
 */
export class Backups {
    constructor(options = DEFAULT_OPTIONS, backupSet = []) {
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: options
        });
        Object.defineProperty(this, "backupSet", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: backupSet
        });
    }
    static volumes(...volumeNames) {
        return new Backups().addSets(...volumeNames.map((srcVolume) => ({
            srcVolume,
            srcPath: "./",
            dstPath: `./${srcVolume}/`,
            dstVolume: Backups.BACKUP,
        })));
    }
    static addSets(...options) {
        return new Backups().addSets(...options);
    }
    static with_options(options) {
        return new Backups({ ...DEFAULT_OPTIONS, ...options });
    }
    set_options(options) {
        this.options = {
            ...this.options,
            ...options,
        };
        return this;
    }
    volumes(...volumeNames) {
        return this.addSets(...volumeNames.map((srcVolume) => ({
            srcVolume,
            srcPath: "./",
            dstPath: `./${srcVolume}/`,
            dstVolume: Backups.BACKUP,
        })));
    }
    addSets(...options) {
        options.forEach((x) => this.backupSet.push({ ...x, options: { ...this.options, ...x.options } }));
        return this;
    }
    build() {
        const createBackup = async (effects) => {
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
                        ...this.options,
                        ...item.options,
                    },
                }).wait();
            }
            return ok;
        };
        const restoreBackup = async (effects) => {
            for (const item of this.backupSet) {
                if (notEmptyPath(item.srcPath)) {
                    await effects.createDir({
                        volumeId: item.srcVolume,
                        path: item.srcPath,
                    });
                }
                await effects.runRsync({
                    options: {
                        ...this.options,
                        ...item.options,
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
Object.defineProperty(Backups, "BACKUP", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "BACKUP"
});
function notEmptyPath(file) {
    return ["", ".", "./"].indexOf(file) === -1;
}
