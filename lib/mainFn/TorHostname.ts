import { Effects } from "../types"
import { TorBinding } from "./TorBinding"

export class TorHostname {
  constructor(readonly effects: Effects, readonly id: string) {}
  static of(effects: Effects, id: string) {
    return new TorHostname(effects, id)
  }
  async bindTor(internalPort: number, externalPort: number) {
    const address = await this.effects.bindTor({
      internalPort,
      name: this.id,
      externalPort,
    })
    return new TorBinding(address)
  }
}
