import { Effects } from "../types"
import { TorHostname } from "./TorHostname"

export class NetworkBuilder {
  static of(effects: Effects) {
    return new NetworkBuilder(effects)
  }
  private constructor(private effects: Effects) {}

  getTorHostName(id: string) {
    return new TorHostname(this.effects, id)
  }
}
