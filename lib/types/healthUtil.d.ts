import { Effects, ResultType } from "./types.js";
export declare const checkWebUrl: (url: string) => (effects: Effects, duration: number) => Promise<ResultType<null | void>>;
export declare const runHealthScript: ({ command, args }: {
    command: string;
    args: string[];
}) => (effects: Effects, _duration: number) => Promise<ResultType<null | void>>;
export declare const guardDurationAboveMinimum: (input: {
    duration: number;
    minimumTime: number;
}) => {
    "error-code": readonly [number, string];
} | null;
export declare const catchError: (effects: Effects) => (e: unknown) => import("./types.js").KnownError;
