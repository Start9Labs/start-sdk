import { Effects } from "../types";
import { LocalBinding } from "./LocalBinding";

export class LocalPort {
  constructor(readonly effects: Effects, readonly id: string) {}
  async bindLan(internalPort: number) {
    const [localAddress, ipAddress] = await this.effects.bindLan({
      internalPort,
      name: this.id,
    });
    return new LocalBinding(localAddress, ipAddress);
  }
}
