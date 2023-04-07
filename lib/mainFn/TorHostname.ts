import { Effects } from "../types";
import { TorBinding } from "./TorBinding";

export class TorHostname {
  constructor(readonly id: string, readonly effects: Effects) {}
  async bindTor(internalPort: number, externalPort: number) {
    const address = await this.effects.bindTor({
      internalPort,
      name: this.id,
      externalPort,
    });
    return new TorBinding(address);
  }
}
