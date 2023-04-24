import { string } from "ts-matches";
import { Backups } from ".";
import { GenericManifest } from "../manifest/ManifestTypes";
import { BackupOptions, ExpectedExports } from "../types";

export type SetupBackupsParams<M extends GenericManifest> =
  | [Partial<BackupOptions>, ...Array<keyof M["volumes"] & string>]
  | Array<keyof M["volumes"] & string>;

export function setupBackups<M extends GenericManifest>(
  ...args: SetupBackupsParams<M>
) {
  const [options, volumes] = splitOptions(args);
  if (!options) {
    return Backups.volumes(...volumes).build();
  }
  return Backups.with_options(options)
    .volumes(...volumes)
    .build();
}

function splitOptions<M extends GenericManifest>(
  args: SetupBackupsParams<M>,
): [null | Partial<BackupOptions>, Array<keyof M["volumes"] & string>] {
  if (args.length > 0 && !string.test(args[0])) {
    const [options, ...restVolumes] = args;
    return [options, restVolumes as Array<keyof M["volumes"] & string>];
  }
  return [null, args as Array<keyof M["volumes"] & string>];
}
