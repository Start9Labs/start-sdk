import {
  Address,
  Effects,
  EnsureStorePath,
  HostName,
  NetworkInterface,
  hostName,
} from "../types"
import * as regexes from "./regexes"

export type UrlString = string
export type HostId = string

export type Filled = {
  hostnames: HostName[]
  onionHostnames: HostName[]
  localHostnames: HostName[]
  ipHostnames: HostName[]
  ipv4Hostnames: HostName[]
  ipv6Hostnames: HostName[]
  nonIpHostnames: HostName[]
  allHostnames: HostName[]

  urls: UrlString[]
  onionUrls: UrlString[]
  localUrls: UrlString[]
  ipUrls: UrlString[]
  ipv4Urls: UrlString[]
  ipv6Urls: UrlString[]
  nonIpUrls: UrlString[]
  allUrls: UrlString[]
}
export type FilledAddress = Address & Filled
export type NetworkInterfaceFilled = {
  interfaceId: string
  /** The title of this field to be displayed */
  name: string
  /** Human readable description, used as tooltip usually */
  description: string
  /** All URIs */
  addresses: FilledAddress[]
  /** Defaults to false, but describes if this address can be opened in a browser as an
   * ui interface
   */
  ui?: boolean
} & Filled
const either =
  <A>(...args: ((a: A) => boolean)[]) =>
  (a: A) =>
    args.some((x) => x(a))
const negate =
  <A>(fn: (a: A) => boolean) =>
  (a: A) =>
    !fn(a)
const unique = <A>(values: A[]) => Array.from(new Set(values))
const addressHostToUrl = (
  { scheme, username, suffix }: Address,
  host: HostName,
): UrlString =>
  `${scheme ? `${scheme}//` : ""}${
    username ? `${username}@` : ""
  }${host}${suffix}`
export const filledAddress = (
  mapHostnames: {
    [hostId: string]: HostName[]
  },
  address: Address,
): FilledAddress => {
  const toUrl = addressHostToUrl.bind(null, address)
  const hostnames = mapHostnames[address.hostId] ?? []
  return {
    ...address,
    hostnames,
    get onionHostnames() {
      return hostnames.filter(regexes.onionHost.test)
    },
    get localHostnames() {
      return hostnames.filter(regexes.localHost.test)
    },
    get ipHostnames() {
      return hostnames.filter(either(regexes.ipv4.test, regexes.ipv6.test))
    },
    get ipv4Hostnames() {
      return hostnames.filter(regexes.ipv4.test)
    },
    get ipv6Hostnames() {
      return hostnames.filter(regexes.ipv6.test)
    },
    get nonIpHostnames() {
      return hostnames.filter(
        negate(either(regexes.ipv4.test, regexes.ipv6.test)),
      )
    },
    allHostnames: hostnames,
    get urls() {
      return hostnames.map(toUrl)
    },
    get onionUrls() {
      return hostnames.filter(regexes.onionHost.test).map(toUrl)
    },
    get localUrls() {
      return hostnames.filter(regexes.localHost.test).map(toUrl)
    },
    get ipUrls() {
      return hostnames
        .filter(either(regexes.ipv4.test, regexes.ipv6.test))
        .map(toUrl)
    },
    get ipv4Urls() {
      return hostnames.filter(regexes.ipv4.test).map(toUrl)
    },
    get ipv6Urls() {
      return hostnames.filter(regexes.ipv6.test).map(toUrl)
    },
    get nonIpUrls() {
      return hostnames
        .filter(negate(either(regexes.ipv4.test, regexes.ipv6.test)))
        .map(toUrl)
    },
    get allUrls() {
      return hostnames.map(toUrl)
    },
  }
}

export const networkInterfaceFilled = (
  interfaceValue: NetworkInterface,
  addresses: FilledAddress[],
): NetworkInterfaceFilled => {
  return {
    ...interfaceValue,
    addresses,
    get hostnames() {
      return unique(addresses.flatMap((x) => x.hostnames))
    },
    get onionHostnames() {
      return unique(addresses.flatMap((x) => x.onionHostnames))
    },
    get localHostnames() {
      return unique(addresses.flatMap((x) => x.localHostnames))
    },
    get ipHostnames() {
      return unique(addresses.flatMap((x) => x.ipHostnames))
    },
    get ipv4Hostnames() {
      return unique(addresses.flatMap((x) => x.ipv4Hostnames))
    },
    get ipv6Hostnames() {
      return unique(addresses.flatMap((x) => x.ipv6Hostnames))
    },
    get nonIpHostnames() {
      return unique(addresses.flatMap((x) => x.nonIpHostnames))
    },
    get allHostnames() {
      return unique(addresses.flatMap((x) => x.allHostnames))
    },
    get urls() {
      return unique(addresses.flatMap((x) => x.urls))
    },
    get onionUrls() {
      return unique(addresses.flatMap((x) => x.onionUrls))
    },
    get localUrls() {
      return unique(addresses.flatMap((x) => x.localUrls))
    },
    get ipUrls() {
      return unique(addresses.flatMap((x) => x.ipUrls))
    },
    get ipv4Urls() {
      return unique(addresses.flatMap((x) => x.ipv4Urls))
    },
    get ipv6Urls() {
      return unique(addresses.flatMap((x) => x.ipv6Urls))
    },
    get nonIpUrls() {
      return unique(addresses.flatMap((x) => x.nonIpUrls))
    },
    get allUrls() {
      return unique(addresses.flatMap((x) => x.allUrls))
    },
  }
}
const makeInterfaceFilled = async ({
  effects,
  interfaceId,
  packageId,
  callback,
}: {
  effects: Effects
  interfaceId: string
  packageId: string | undefined
  callback: () => void
}) => {
  const interfaceValue = await effects.getInterface({
    interfaceId,
    packageId,
    callback,
  })
  const hostIdsRecord: { [hostId: HostId]: HostName[] } = Object.fromEntries(
    await Promise.all(
      unique(interfaceValue.addresses.map((x) => x.hostId)).map(
        async (hostId) => [
          hostId,
          effects.getHostnames({
            packageId,
            hostId,
            callback,
          }),
        ],
      ),
    ),
  )

  const fillAddress = filledAddress.bind(null, hostIdsRecord)
  const interfaceFilled: NetworkInterfaceFilled = networkInterfaceFilled(
    interfaceValue,
    interfaceValue.addresses.map(fillAddress),
  )
  return interfaceFilled
}

export class GetNetworkInterface {
  constructor(
    readonly effects: Effects,
    readonly opts: { interfaceId: string; packageId?: string },
  ) {}

  /**
   * Returns the value of Store at the provided path. Restart the service if the value changes
   */
  async const() {
    const { interfaceId, packageId } = this.opts
    const callback = this.effects.restart
    const interfaceFilled: NetworkInterfaceFilled = await makeInterfaceFilled({
      effects: this.effects,
      interfaceId,
      packageId,
      callback,
    })

    return interfaceFilled
  }
  /**
   * Returns the value of NetworkInterfacesFilled at the provided path. Does nothing if the value changes
   */
  async once() {
    const { interfaceId, packageId } = this.opts
    const callback = () => {}
    const interfaceFilled: NetworkInterfaceFilled = await makeInterfaceFilled({
      effects: this.effects,
      interfaceId,
      packageId,
      callback,
    })

    return interfaceFilled
  }

  /**
   * Watches the value of NetworkInterfacesFilled at the provided path. Takes a custom callback function to run whenever the value changes
   */
  async *watch() {
    const { interfaceId, packageId } = this.opts
    while (true) {
      let callback: () => void = () => {}
      const waitForNext = new Promise<void>((resolve) => {
        callback = resolve
      })
      yield await makeInterfaceFilled({
        effects: this.effects,
        interfaceId,
        packageId,
        callback,
      })
      await waitForNext
    }
  }
}
export function getNetworkInterface(
  effects: Effects,
  opts: { interfaceId: string; packageId?: string },
) {
  return new GetNetworkInterface(effects, opts)
}
