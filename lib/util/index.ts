import * as T from "../types";

export { guardAll, typeFromProps } from "./propertiesMatcher";
export { default as nullIfEmpty } from "./nullIfEmpty";
export { FileHelper } from "./fileHelper";

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
