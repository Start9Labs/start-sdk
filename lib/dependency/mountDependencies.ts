import { Effects } from "../types"
import {
  Path,
  ManifestId,
  VolumeName,
  NamedPath,
  matchPath,
} from "./setupDependencyMounts"

export type MountDependenciesOut<A> =
  // prettier-ignore
  A extends Path ? string : A extends Record<string, unknown> ? {
    [P in keyof A]: MountDependenciesOut<A[P]>;
  } : never
export async function mountDependencies<
  In extends
    | Record<ManifestId, Record<VolumeName, Record<NamedPath, Path>>>
    | Record<VolumeName, Record<NamedPath, Path>>
    | Record<NamedPath, Path>
    | Path,
>(effects: Effects, value: In): Promise<MountDependenciesOut<In>> {
  if (matchPath.test(value)) {
    const mountPath = `${value.manifest.id}/${value.volume}/${value.name}`

    return (await effects.mount({
      location: {
        path: mountPath,
      },
      target: {
        packageId: value.manifest.id,
        path: value.path,
        readonly: value.readonly,
        volumeId: value.volume,
      },
    })) as MountDependenciesOut<In>
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, value]) => [
      key,
      mountDependencies(effects, value),
    ]),
  ) as Record<string, unknown> as MountDependenciesOut<In>
}
