import { ConfigFile } from "./config_file";

/**
 * A useful tool when doing a getConfig.
 * Look into the config {@link ConfigFile} for an example of the use.
 * @param s
 * @returns
 */
export function nullIfEmpty(s: Record<string, unknown>) {
  return Object.keys(s).length === 0 ? null : s;
}

export { setupConfigExports } from "./setup_config_export";
export { ConfigFile };
