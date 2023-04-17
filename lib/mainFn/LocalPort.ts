import { Effects } from "../types";
import { LocalBinding } from "./LocalBinding";

export class LocalPort {
  constructor(readonly effects: Effects, readonly id: string) {}
  async bindLan(internalPort: number) {
    const port = await this.effects.bindLan({
      internalPort,
      name: this.id,
    });
    const localAddress = `${await this.effects.getLocalHostname()}:${port}`;
    const ipAddress = `${await this.effects.getIPHostname()}:${port}`;
    return new LocalBinding(localAddress, ipAddress);
  }
}
