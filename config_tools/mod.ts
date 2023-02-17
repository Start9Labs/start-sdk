import { ConfigFile } from "./config_file.ts";

/**
 * A useful tool when doing a getConfig.
 * Look into the config {@link ConfigFile} for an example of the use.
 * @param s
 * @returns
 */
export function nullIfEmpty(s: Record<string, unknown>) {
  return Object.keys(s).length === 0 ? null : s;
}

export { ConfigFile };
