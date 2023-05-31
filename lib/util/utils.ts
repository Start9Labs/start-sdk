import FileHelper from "./fileHelper"
import nullIfEmpty from "./nullIfEmpty"
import {
  CheckResult,
  checkPortListening,
  checkWebUrl,
} from "../health/checkFns"
import {
  Effects,
  EnsureStorePath,
  ExtractStore,
  InterfaceId,
  PackageId,
} from "../types"
import { GetSystemSmtp } from "./GetSystemSmtp"
import { DefaultString } from "../config/configTypes"
import { getDefaultString } from "./getDefaultString"
import { GetStore, getStore } from "../store/getStore"
import {
  MountDependenciesOut,
  mountDependencies,
} from "../dependency/mountDependencies"
import {
  ManifestId,
  VolumeName,
  NamedPath,
  Path,
} from "../dependency/setupDependencyMounts"
import { Host, MultiHost, SingleHost, StaticHost } from "../interfaces/Host"
import { NetworkInterfaceBuilder } from "../interfaces/NetworkInterfaceBuilder"
import { GetNetworkInterface, getNetworkInterface } from "./getNetworkInterface"
import {
  GetNetworkInterfaces,
  getNetworkInterfaces,
} from "./getNetworkInterfaces"

export type Utils<Store, WrapperOverWrite = { const: never }> = {
  checkPortListening(
    port: number,
    options: {
      errorMessage: string
      successMessage: string
      timeoutMessage?: string
      timeout?: number
    },
  ): Promise<CheckResult>
  checkWebUrl(
    url: string,
    options?: {
      timeout?: number
      successMessage?: string
      errorMessage?: string
    },
  ): Promise<CheckResult>
  createInterface: (options: {
    name: string
    id: string
    description: string
    hasPrimary: boolean
    disabled: boolean
    ui: boolean
    username: null | string
    path: string
    search: Record<string, string>
  }) => NetworkInterfaceBuilder
  getSystemSmtp: () => GetSystemSmtp & WrapperOverWrite
  host: {
    static: (id: string) => StaticHost
    single: (id: string) => SingleHost
    multi: (id: string) => MultiHost
  }
  mountDependencies: <
    In extends
      | Record<ManifestId, Record<VolumeName, Record<NamedPath, Path>>>
      | Record<VolumeName, Record<NamedPath, Path>>
      | Record<NamedPath, Path>
      | Path,
  >(
    value: In,
  ) => Promise<MountDependenciesOut<In>>
  networkInterface: {
    getOwn: (interfaceId: InterfaceId) => GetNetworkInterface & WrapperOverWrite
    get: (opts: {
      interfaceId: InterfaceId
      packageId: PackageId
    }) => GetNetworkInterface & WrapperOverWrite
    getAllOwn: () => GetNetworkInterfaces & WrapperOverWrite
    getAll: (opts: {
      packageId: PackageId
    }) => GetNetworkInterfaces & WrapperOverWrite
  }
  nullIfEmpty: typeof nullIfEmpty
  readFile: <A>(fileHelper: FileHelper<A>) => ReturnType<FileHelper<A>["read"]>
  store: {
    get: <Path extends string>(
      packageId: string,
      path: EnsureStorePath<Store, Path>,
    ) => GetStore<Store, Path> & WrapperOverWrite
    getOwn: <Path extends string>(
      path: EnsureStorePath<Store, Path>,
    ) => GetStore<Store, Path> & WrapperOverWrite
    setOwn: <Path extends string | never>(
      path: EnsureStorePath<Store, Path>,
      value: ExtractStore<Store, Path>,
    ) => Promise<void>
  }
  writeFile: <A>(
    fileHelper: FileHelper<A>,
    data: A,
  ) => ReturnType<FileHelper<A>["write"]>
}
export const utils = <Store = never, WrapperOverWrite = { const: never }>(
  effects: Effects,
): Utils<Store, WrapperOverWrite> => ({
  createInterface: (options: {
    name: string
    id: string
    description: string
    hasPrimary: boolean
    disabled: boolean
    ui: boolean
    username: null | string
    path: string
    search: Record<string, string>
  }) => new NetworkInterfaceBuilder({ ...options, effects }),
  getSystemSmtp: () =>
    new GetSystemSmtp(effects) as GetSystemSmtp & WrapperOverWrite,

  host: {
    static: (id: string) => new StaticHost({ id, effects }),
    single: (id: string) => new SingleHost({ id, effects }),
    multi: (id: string) => new MultiHost({ id, effects }),
  },
  readFile: <A>(fileHelper: FileHelper<A>) => fileHelper.read(effects),
  writeFile: <A>(fileHelper: FileHelper<A>, data: A) =>
    fileHelper.write(data, effects),
  nullIfEmpty,

  networkInterface: {
    getOwn: (interfaceId: InterfaceId) =>
      getNetworkInterface(effects, { interfaceId }) as GetNetworkInterface &
        WrapperOverWrite,
    get: (opts: { interfaceId: InterfaceId; packageId: PackageId }) =>
      getNetworkInterface(effects, opts) as GetNetworkInterface &
        WrapperOverWrite,
    getAllOwn: () =>
      getNetworkInterfaces(effects, {}) as GetNetworkInterfaces &
        WrapperOverWrite,
    getAll: (opts: { packageId: PackageId }) =>
      getNetworkInterfaces(effects, opts) as GetNetworkInterfaces &
        WrapperOverWrite,
  },
  store: {
    get: <Path extends string = never>(
      packageId: string,
      path: EnsureStorePath<Store, Path>,
    ) =>
      getStore<Store, Path>(effects, path as any, {
        packageId,
      }) as any,
    getOwn: <Path extends string>(path: EnsureStorePath<Store, Path>) =>
      getStore<Store, Path>(effects, path as any) as any,
    setOwn: <Path extends string | never>(
      path: EnsureStorePath<Store, Path>,
      value: ExtractStore<Store, Path>,
    ) => effects.store.set<Store, Path>({ value, path: path as any }),
  },
  checkPortListening: checkPortListening.bind(null, effects),
  checkWebUrl: checkWebUrl.bind(null, effects),

  mountDependencies: <
    In extends
      | Record<ManifestId, Record<VolumeName, Record<NamedPath, Path>>>
      | Record<VolumeName, Record<NamedPath, Path>>
      | Record<NamedPath, Path>
      | Path,
  >(
    value: In,
  ) => mountDependencies(effects, value),
})
function noop(): void {}
