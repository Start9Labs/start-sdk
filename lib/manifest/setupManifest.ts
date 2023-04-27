import { GenericManifest, ManifestVersion } from "./ManifestTypes"

export function setupManifest<
  Id extends string,
  Version extends ManifestVersion,
  Dependencies extends Record<string, unknown>,
  Volumes extends Record<string, unknown>,
  Manifest extends GenericManifest & {
    dependencies: Dependencies
    id: Id
    version: Version
    volumes: Volumes
  },
>(manifest: Manifest): Manifest {
  return manifest
}
