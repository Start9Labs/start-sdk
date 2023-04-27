import { GenericManifest } from "../manifest/ManifestTypes"
import { Dependency, PackageId } from "../types"

export type Dependencies<T extends GenericManifest> = {
  exists(id: keyof T["dependencies"]): Dependency
  running(id: keyof T["dependencies"]): Dependency
}

export const dependenciesSet = <
  T extends GenericManifest,
>(): Dependencies<T> => ({
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
