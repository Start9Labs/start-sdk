import { GenericManifest, ManifestVersion } from "./ManifestTypes";

export function setupManifest<
  M extends GenericManifest & { id: Id; version: Version },
  Id extends string,
  Version extends ManifestVersion,
>(manifest: M): M {
  return manifest;
}
