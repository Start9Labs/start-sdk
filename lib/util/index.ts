import { Parser, string } from "ts-matches";
import * as T from "../types";
import FileHelper from "./fileHelper";
import nullIfEmpty from "./nullIfEmpty";
import { getWrapperData } from "./getWrapperData";
import { checkPortListening, checkWebUrl } from "../health/checkFns";
import { LocalPort, NetworkBuilder, TorHostname } from "../mainFn";

export { guardAll, typeFromProps } from "./propertiesMatcher";
export { default as nullIfEmpty } from "./nullIfEmpty";
export { FileHelper } from "./fileHelper";
export { getWrapperData } from "./getWrapperData";

/** Used to check if the file exists before hand */
export const exists = (
  effects: T.Effects,
  props: { path: string; volumeId: string }
) =>
  effects.metadata(props).then(
    (_) => true,
    (_) => false
  );

export const isKnownError = (e: unknown): e is T.KnownError =>
  e instanceof Object && ("error" in e || "error-code" in e);

type Cdr<A> = A extends [unknown, ...infer Cdr] ? Cdr : [];

export const utils = (effects: T.Effects) => ({
  readFile: <A>(fileHelper: FileHelper<A>) => fileHelper.read(effects),
  writeFile: <A>(fileHelper: FileHelper<A>, data: A) =>
    fileHelper.write(data, effects),
  exists: (props: { path: string; volumeId: string }) => exists(effects, props),
  nullIfEmpty,
  getWrapperData: <A>(
    validator: Parser<unknown, A>,
    options: {
      /** Defaults to what ever the package currently in */
      packageId?: string | undefined;
      /** JsonPath */
      path?: string | undefined;
    } = {}
  ) => getWrapperData(effects, validator, options),
  setWrapperData: <A>(
    value: A,
    options: { packageId?: string | undefined; path?: string | undefined } = {}
  ) => effects.setWrapperData({ ...options, value }),
  checkPortListening: checkPortListening.bind(null, effects),
  checkWebUrl: checkWebUrl.bind(null, effects),
  localPort: LocalPort.bind(null, effects),
  networkBuilder: NetworkBuilder.of.bind(null, effects),
  torHostName: TorHostname.of.bind(null, effects),
});
