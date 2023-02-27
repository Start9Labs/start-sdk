import * as T from "./types.js";
export { guardAll, typeFromProps } from "./utils/propertiesMatcher.js";
export declare function unwrapResultType<T>(res: T.ResultType<T>): T;
/** Used to check if the file exists before hand */
export declare const exists: (effects: T.Effects, props: {
    path: string;
    volumeId: string;
}) => Promise<boolean>;
export declare const errorCode: (code: number, error: string) => {
    "error-code": readonly [number, string];
};
export declare const error: (error: string) => {
    error: string;
};
export declare const ok: {
    result: null;
};
export declare const isKnownError: (e: unknown) => e is T.KnownError;
