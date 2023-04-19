import { Parser, string } from "ts-matches";
import * as T from "../types";
import FileHelper from "./fileHelper";
import nullIfEmpty from "./nullIfEmpty";
import { getWrapperData } from "./getWrapperData";
import { checkPortListening, checkWebUrl } from "../health/checkFns";
import { LocalPort, NetworkBuilder, TorHostname } from "../mainFn";
import { ExtractWrapperData } from "../types";

export { guardAll, typeFromProps } from "./propertiesMatcher";
export { default as nullIfEmpty } from "./nullIfEmpty";
export { FileHelper } from "./fileHelper";
export { getWrapperData } from "./getWrapperData";
export { deepEqual } from "./deepEqual";
export { deepMerge } from "./deepMerge";

/** Used to check if the file exists before hand */
export const exists = (
  effects: T.Effects,
  props: { path: string; volumeId: string },
) =>
  effects.metadata(props).then(
    (_) => true,
    (_) => false,
  );

export const isKnownError = (e: unknown): e is T.KnownError =>
  e instanceof Object && ("error" in e || "error-code" in e);

type Cdr<A> = A extends [unknown, ...infer Cdr] ? Cdr : [];

declare const affine: unique symbol;

function withAffine<B>() {
  return {} as { [affine]: B };
}

export const utils = <WrapperData = never>(effects: T.Effects) => ({
  readFile: <A>(fileHelper: FileHelper<A>) => fileHelper.read(effects),
  writeFile: <A>(fileHelper: FileHelper<A>, data: A) =>
    fileHelper.write(data, effects),
  exists: (props: { path: string; volumeId: string }) => exists(effects, props),
  nullIfEmpty,
  getWrapperData: <Path extends string>(
    path: T.EnsureWrapperDataPath<WrapperData, Path>,
    options: {
      validator?: Parser<unknown, ExtractWrapperData<WrapperData, Path>>;
      /** Defaults to what ever the package currently in */
      packageId?: string | undefined;
    } = {},
  ) => getWrapperData<WrapperData, Path>(effects, path as any, options),
  setWrapperData: <Path extends string | never>(
    path: T.EnsureWrapperDataPath<WrapperData, Path>,
    value: ExtractWrapperData<WrapperData, Path>,
  ) => effects.setWrapperData<WrapperData, Path>({ value, path: path as any }),
  checkPortListening: checkPortListening.bind(null, effects),
  checkWebUrl: checkWebUrl.bind(null, effects),
  localPort: LocalPort.bind(null, effects),
  networkBuilder: NetworkBuilder.of.bind(null, effects),
  torHostName: TorHostname.of.bind(null, effects),
});

type NeverPossible = { [affine]: string };
export type NoAny<A> = NeverPossible extends A
  ? keyof NeverPossible extends keyof A
    ? never
    : A
  : A;
