import { Effects } from "../types"
import { AddressReceipt } from "./AddressReceipt"
import { Origin } from "./Origin"

/**
 * A helper class for creating a Network Interface
 *
 * Network Interfaces are collections of web addresses that expose the same API or other resource,
 * display to the user with under a common name and description.
 *
 * All URIs on an interface inherit the same ui: bool, basic auth credentials, path, and search (query) params
 *
 * @param options
 * @returns
 */
export class NetworkInterfaceBuilder {
  constructor(
    readonly options: {
      effects: Effects
      name: string
      id: string
      description: string
      ui: boolean
      basic?: null | { password: null | string; username: string }
      path?: string
      search?: Record<string, string>
    },
  ) {}

  /**
   * A function to register a group of origins (<PROTOCOL> :// <HOSTNAME> : <PORT>) with StartOS
   *
   * The returned addressReceipt serves as proof that the addresses were registered
   *
   * @param addresses
   * @returns
   */
  async exportAddresses(addresses: Iterable<Origin>) {
    const { name, description, id, ui, path, search } = this.options
    for (const origin of addresses) {
      const address = origin.withAuth(this.options.basic)
      await this.options.effects.exportAddress({
        name,
        description,
        address,
        id,
        ui,
        path,
        search,
      })
    }
    return {} as AddressReceipt
  }
}
