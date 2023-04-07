import { Effects } from "../types";
import { AddressReceipt } from "./AddressReceipt";
import { Origin } from "./Origin";

export class NetworkInterfaceBuilder {
  constructor(
    readonly options: {
      effects: Effects;
      name: string;
      id: string;
      description: string;
      ui: boolean;
      basic?: null | { password: string; username: string };
      path?: string;
      search?: Record<string, string>;
    }
  ) {}

  async exportAddresses(addresses: Iterable<Origin>) {
    const { name, description, id, ui, path, search } = this.options;
    // prettier-ignore
    const urlAuth = !!(this.options?.basic) ? `${this.options.basic.username}:${this.options.basic.password}@` :
            '';
    for (const origin of addresses) {
      const address = `${origin.protocol}://${urlAuth}${origin.address}`;
      await this.options.effects.exportAddress({
        name,
        description,
        address,
        id,
        ui,
        path,
        search,
      });
    }
    return {} as AddressReceipt;
  }
}
