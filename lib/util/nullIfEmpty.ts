/**
 * A useful tool when doing a getConfig.
 * Look into the config {@link FileHelper} for an example of the use.
 * @param s
 * @returns
 */
export default function nullIfEmpty(s: null | Record<string, unknown>) {
  if (s === null) return null
  return Object.keys(s).length === 0 ? null : s
}
