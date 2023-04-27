import { Effects } from "../../types"
import { CheckResult } from "./CheckResult"
export function containsAddress(x: string, port: number) {
  const readPorts = x
    .split("\n")
    .filter(Boolean)
    .splice(1)
    .map((x) => x.split(" ").filter(Boolean)[1]?.split(":")?.[1])
    .filter(Boolean)
    .map((x) => Number.parseInt(x, 16))
    .filter(Number.isFinite)
  return readPorts.indexOf(port) >= 0
}

/**
 * This is used to check if a port is listening on the system.
 * Used during the health check fn or the check main fn.
 */
export async function checkPortListening(
  effects: Effects,
  port: number,
  {
    error = `Port ${port} is not listening`,
    message = `Port ${port} is available`,
  } = {},
): Promise<CheckResult> {
  const hasAddress =
    containsAddress(await effects.runCommand(`cat /proc/net/tcp`), port) ||
    containsAddress(await effects.runCommand("cat /proc/net/udp"), port)
  if (hasAddress) {
    return { status: "passing", message }
  }
  return {
    status: "failing",
    message: error,
  }
}
