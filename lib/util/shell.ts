import { Effects } from "../types";

export function sh(shellCommand: string) {
  return {
    command: "sh",
    args: ["-c", shellCommand],
  } as Parameters<Effects["runCommand"]>[0];
}
