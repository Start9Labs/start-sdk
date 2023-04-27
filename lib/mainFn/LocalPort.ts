import { Effects } from "../types"
import { LocalBinding } from "./LocalBinding"

export class LocalPort {
  constructor(readonly effects: Effects) {}
  static async bindLan(effects: Effects, internalPort: number) {
    const port = await effects.bindLan({
      internalPort,
    })
    const localAddress = `${await effects.getLocalHostname()}:${port}`
    const ipAddress = await (
      await effects.getIPHostname()
    ).map((x) => `${x}:${port}`)
    return new LocalBinding(localAddress, ipAddress)
  }
}
