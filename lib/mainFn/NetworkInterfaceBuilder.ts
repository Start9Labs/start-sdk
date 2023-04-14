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
    for (const origin of addresses) {
      const address = origin.withAuth(this.options.basic);
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
