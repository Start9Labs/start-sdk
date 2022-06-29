import { Effects } from "./types.ts";

/** Used to check if the file exists before hand */
export const exists = (effects: Effects, props: { path: string, volumeId: string }) => effects.metadata(props).then(_ => true, _ => false);