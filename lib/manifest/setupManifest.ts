import { SDKManifest, ManifestVersion } from "./ManifestTypes"

export function setupManifest<
  Id extends string,
  Version extends ManifestVersion,
  Dependencies extends Record<string, unknown>,
  Volumes extends string[],
  Manifest extends SDKManifest & {
    dependencies: Dependencies
    id: Id
    version: Version
    volumes: Volumes
  },
>(manifest: Manifest): Manifest {
  return manifest
}
