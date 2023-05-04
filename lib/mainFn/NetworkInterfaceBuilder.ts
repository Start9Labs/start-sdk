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
      basic: null | { username: string }
      path: string
      search: Record<string, string>
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
  async export(origins: Iterable<Origin>) {
    const { name, description, id, ui, basic, path, search } = this.options

    const addresses = Array.from(origins).map((o) =>
      o.build({ basic, path, search }),
    )

    await this.options.effects.exportNetworkInterface({
      id,
      name,
      description,
      addresses,
      ui,
    })

    return {} as AddressReceipt
  }
}
