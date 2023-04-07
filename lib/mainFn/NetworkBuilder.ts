import { Effects } from "../types";
import { LocalPort } from "./LocalPort";
import { TorHostname } from "./TorHostname";

export class NetworkBuilder {
  static of(effects: Effects) {
    return new NetworkBuilder(effects);
  }
  private constructor(private effects: Effects) {}

  getTorHostName(id: string) {
    return new TorHostname(id, this.effects);
  }
  getPort(id: string) {
    return new LocalPort(id, this.effects);
  }
}
