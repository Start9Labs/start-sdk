import { Effects } from "../types";
import { LocalBinding } from "./LocalBinding";

export class LocalPort {
  constructor(readonly id: string, readonly effects: Effects) {}
  async bindLan(internalPort: number) {
    const [localAddress, ipAddress] = await this.effects.bindLan({
      internalPort,
      name: this.id,
    });
    return new LocalBinding(localAddress, ipAddress);
  }
}
