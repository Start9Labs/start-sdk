import type { Mark } from "./mark.js";
export declare class YAMLError extends Error {
    protected mark: Mark | string;
    constructor(message?: string, mark?: Mark | string);
    toString(_compact: boolean): string;
}
