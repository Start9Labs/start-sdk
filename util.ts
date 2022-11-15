import * as T from "./types.ts";

export function unwrapResultType<T>(res: T.ResultType<T>): T {
  if ("error-code" in res) {
    throw new Error(res["error-code"][1]);
  } else if ("error" in res) {
    throw new Error(res["error"]);
  } else {
    return res.result;
  }
}

/** Used to check if the file exists before hand */
export const exists = (
  effects: T.Effects,
  props: { path: string; volumeId: string },
) => effects.metadata(props).then((_) => true, (_) => false);

export const errorCode = (code: number, error: string) => ({
  "error-code": [code, error] as const,
});
export const error = (error: string) => ({ error });
export const ok = { result: null };

export const isKnownError = (e: unknown): e is T.KnownError =>
  e instanceof Object && ("error" in e || "error-code" in e);
