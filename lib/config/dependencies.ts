import { SDKManifest } from "../manifest/ManifestTypes"
import { Dependency, PackageId } from "../types"

export type Dependencies<T extends SDKManifest> = {
  exists(id: keyof T["dependencies"]): Dependency
  running(id: keyof T["dependencies"]): Dependency
}

export const dependenciesSet = <T extends SDKManifest>(): Dependencies<T> => ({
  exists(id: keyof T["dependencies"]) {
    return {
      id,
      kind: "exists",
    } as Dependency
  },

  running(id: keyof T["dependencies"]) {
    return {
      id,
      kind: "running",
    } as Dependency
  },
})
