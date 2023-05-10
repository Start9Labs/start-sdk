import { boolean, object, string } from "ts-matches"
import { SDKManifest } from "../manifest/ManifestTypes"
import { deepMerge } from "../util/deepMerge"

export type VolumeName = string
export type NamedPath = string
export type ManifestId = string

export const matchPath = object({
  name: string,
  volume: string,
  path: string,
  manifest: object({
    id: string,
  }),
  readonly: boolean,
})
export type Path = typeof matchPath._TYPE
export type BuildPath<M extends Path> = {
  [PId in M["manifest"]["id"]]: {
    [V in M["volume"]]: {
      [N in M["name"]]: M
    }
  }
}
type ValidIfNotInNested<
  Building,
  M extends Path,
> = Building extends BuildPath<M> ? never : M
class SetupDependencyMounts<Building> {
  private constructor(readonly building: Building) {}

  static of() {
    return new SetupDependencyMounts({})
  }

  addPath<
    NamedPath extends string,
    VolumeName extends string,
    PathNamed extends string,
    M extends SDKManifest,
  >(
    newPath: ValidIfNotInNested<
      Building,
      {
        name: NamedPath
        volume: VolumeName
        path: PathNamed
        manifest: M
        readonly: boolean
      }
    >,
  ) {
    const building = deepMerge(this.building, {
      [newPath.manifest.id]: {
        [newPath.volume]: {
          [newPath.name]: newPath,
        },
      },
    }) as Building & BuildPath<typeof newPath>
    return new SetupDependencyMounts(building)
  }
  build() {
    return this.building
  }
}

export function setupDependencyMounts() {
  return SetupDependencyMounts.of()
}
