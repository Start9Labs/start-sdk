import { CbFunction } from "./loader/loader.js";
import type { LoaderStateOptions } from "./loader/loader_state.js";
export type ParseOptions = LoaderStateOptions;
/**
 * Parses `content` as single YAML document.
 *
 * Returns a JavaScript object or throws `YAMLException` on error.
 * By default, does not support regexps, functions and undefined. This method is safe for untrusted data.
 */
export declare function parse(content: string, options?: ParseOptions): unknown;
/**
 * Same as `parse()`, but understands multi-document sources.
 * Applies iterator to each document if specified, or returns array of documents.
 */
export declare function parseAll(content: string, iterator: CbFunction, options?: ParseOptions): void;
export declare function parseAll(content: string, options?: ParseOptions): unknown;
