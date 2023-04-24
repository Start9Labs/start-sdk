import { GenericManifest } from "./ManifestTypes";

export function setupManifest<
  M extends GenericManifest & { id: Id },
  Id extends string,
>(manifest: M): M {
  return manifest;
}
