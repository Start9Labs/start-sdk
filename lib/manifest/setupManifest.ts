import { GenericManifest, ManifestVersion } from "./ManifestTypes";

export function setupManifest<
  Id extends string,
  Version extends ManifestVersion,
  Dependencies extends Record<string, unknown>,
>(
  manifest: GenericManifest & {
    dependencies: Dependencies;
    id: Id;
    version: Version;
  },
): GenericManifest & { dependencies: Dependencies; id: Id; version: Version } {
  return manifest;
}
