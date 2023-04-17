import { Dependency, PackageId } from "../types";

export function exists(id: PackageId) {
  return {
    id,
    kind: "exists",
  } as Dependency;
}

export function running(id: PackageId) {
  return {
    id,
    kind: "running",
  } as Dependency;
}
