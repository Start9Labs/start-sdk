import * as T from "./types.js";
export declare const DEFAULT_OPTIONS: T.BackupOptions;
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
 * ).build()
 * ```
 */
export declare class Backups {
    private options;
    private backupSet;
    static BACKUP: "BACKUP";
    constructor(options?: T.BackupOptions, backupSet?: BackupSet[]);
    static volumes(...volumeNames: string[]): Backups;
    static addSets(...options: BackupSet[]): Backups;
    static with_options(options?: Partial<T.BackupOptions>): Backups;
    set_options(options?: Partial<T.BackupOptions>): this;
    volumes(...volumeNames: string[]): this;
    addSets(...options: BackupSet[]): this;
    build(): {
        createBackup: T.ExpectedExports.createBackup;
        restoreBackup: T.ExpectedExports.restoreBackup;
    };
}
export {};
