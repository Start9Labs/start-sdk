import { Parser, string } from "ts-matches"
import * as T from "../types"
import FileHelper from "./fileHelper"
import nullIfEmpty from "./nullIfEmpty"
import { GetWrapperData, getWrapperData } from "../wrapperData/getWrapperData"
import {
  CheckResult,
  checkPortListening,
  checkWebUrl,
} from "../health/checkFns"
import { ExtractWrapperData } from "../types"
import { GetSystemSmtp } from "./GetSystemSmtp"

import "./nullIfEmpty"
import "./fileHelper"
import "../wrapperData/getWrapperData"
import "./deepEqual"
import "./deepMerge"
import "./once"
import { LocalBinding } from "../mainFn/LocalBinding"
import { LocalPort } from "../mainFn/LocalPort"
import { NetworkBuilder } from "../mainFn/NetworkBuilder"
import { TorHostname } from "../mainFn/TorHostname"
import { DefaultString } from "../config/configTypes"
import { getDefaultString } from "./getDefaultString"
import { WrapperDataContract } from "../wrapperData/wrapperDataContract"

// prettier-ignore
export type FlattenIntersection<T> = 
T extends ArrayLike<any> ? T :
T extends object ? {} & {[P in keyof T]: T[P]} :
 T;

export type _<T> = FlattenIntersection<T>

export const isKnownError = (e: unknown): e is T.KnownError =>
  e instanceof Object && ("error" in e || "error-code" in e)

declare const affine: unique symbol

export type Utils<WD, WrapperOverWrite = { const: never }> = {
  createOrUpdateVault: (opts: {
    key: string
    value: string | null | undefined
    generator: DefaultString
  }) => Promise<null | string>
  readFile: <A>(fileHelper: FileHelper<A>) => ReturnType<FileHelper<A>["read"]>
  writeFile: <A>(
    fileHelper: FileHelper<A>,
    data: A,
  ) => ReturnType<FileHelper<A>["write"]>
  getSystemSmtp: () => GetSystemSmtp & WrapperOverWrite
  getWrapperData: <Path extends string>(
    packageId: string,
    path: T.EnsureWrapperDataPath<WD, Path>,
  ) => GetWrapperData<WD, Path> & WrapperOverWrite
  getOwnWrapperData: <Path extends string>(
    path: T.EnsureWrapperDataPath<WD, Path>,
  ) => GetWrapperData<WD, Path> & WrapperOverWrite
  setOwnWrapperData: <Path extends string | never>(
    path: T.EnsureWrapperDataPath<WD, Path>,
    value: ExtractWrapperData<WD, Path>,
  ) => Promise<void>
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
  bindLan: (port: number) => Promise<LocalBinding>
  networkBuilder: () => NetworkBuilder
  torHostName: (id: string) => TorHostname
  nullIfEmpty: typeof nullIfEmpty
}
export const utils = <WD = never, WrapperOverWrite = { const: never }>(
  effects: T.Effects,
): Utils<WD, WrapperOverWrite> => ({
  createOrUpdateVault: async ({
    key,
    value,
    generator,
  }: {
    key: string
    value: string | null | undefined
    generator: DefaultString
  }) => {
    if (value) {
      await effects.vault.set({ key, value })
      return value
    }
    if (await effects.vault.get({ key })) {
      return null
    }
    const newValue = getDefaultString(generator)
    await effects.vault.set({ key, value: newValue })
    return newValue
  },
  getSystemSmtp: () =>
    new GetSystemSmtp(effects) as GetSystemSmtp & WrapperOverWrite,
  readFile: <A>(fileHelper: FileHelper<A>) => fileHelper.read(effects),
  writeFile: <A>(fileHelper: FileHelper<A>, data: A) =>
    fileHelper.write(data, effects),
  nullIfEmpty,
  getWrapperData: <WrapperData = never, Path extends string = never>(
    packageId: string,
    path: T.EnsureWrapperDataPath<WrapperData, Path>,
  ) =>
    getWrapperData<WrapperData, Path>(effects, path as any, {
      packageId,
    }) as any,
  getOwnWrapperData: <Path extends string>(
    path: T.EnsureWrapperDataPath<WD, Path>,
  ) => getWrapperData<WD, Path>(effects, path as any) as any,
  setOwnWrapperData: <Path extends string | never>(
    path: T.EnsureWrapperDataPath<WD, Path>,
    value: ExtractWrapperData<WD, Path>,
  ) => effects.setWrapperData<WD, Path>({ value, path: path as any }),
  checkPortListening: checkPortListening.bind(null, effects),
  checkWebUrl: checkWebUrl.bind(null, effects),
  bindLan: async (port: number) => LocalPort.bindLan(effects, port),
  networkBuilder: () => NetworkBuilder.of(effects),
  torHostName: (id: string) => TorHostname.of(effects, id),
})

export const createUtils = utils
export const createMainUtils = <WD>(
  wrapperDataContract: WrapperDataContract<WD>,
  effects: T.Effects,
) => createUtils<WD, {}>(wrapperDataContract, effects)

type NeverPossible = { [affine]: string }
export type NoAny<A> = NeverPossible extends A
  ? keyof NeverPossible extends keyof A
    ? never
    : A
  : A
