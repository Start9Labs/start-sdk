import { Effects } from "../types"
import { AddressReceipt } from "./AddressReceipt"
import { NetworkInterfaceBuilder } from "./NetworkInterfaceBuilder"
import { Origin } from "./Origin"

const knownProtocols = {
  http: {
    secure: false,
    ssl: false,
    defaultPort: 80,
    withSsl: "https",
  },
  https: {
    secure: true,
    ssl: true,
    defaultPort: 443,
  },
  ws: {
    secure: false,
    ssl: false,
    defaultPort: 80,
    withSsl: "wss",
  },
  wss: {
    secure: true,
    ssl: true,
    defaultPort: 443,
  },
  ssh: {
    secure: true,
    ssl: false,
    defaultPort: 22,
  },
  bitcoin: {
    secure: true,
    ssl: false,
    defaultPort: 8333,
  },
  grpc: {
    secure: true,
    ssl: true,
    defaultPort: 50051,
  },
  dns: {
    secure: true,
    ssl: false,
    defaultPort: 53,
  },
} as const

type KnownProtocol = keyof typeof knownProtocols

type Scheme = string | null

type BasePortOptions<T extends KnownProtocol> = {
  protocol: T
  preferredExternalPort?: number
  scheme?: Scheme
}
type AddSslOptions = {
  preferredExternalPort: number
  scheme: Scheme
  addXForwardedHeaders?: boolean /** default: false */
}
type Security = { secure: false; ssl: false } | { secure: true; ssl: boolean }
export type PortOptions = {
  scheme: Scheme
  preferredExternalPort: number
  addSsl: AddSslOptions | null
} & Security
type KnownProtocols = typeof knownProtocols
type SslProtocols = {
  [K in keyof KnownProtocols]: KnownProtocols[K] extends { ssl: true }
    ? K
    : never
}[keyof KnownProtocols]
type NotSslProtocols = Exclude<keyof KnownProtocols, SslProtocols>
type OldPortOptionsByKnownProtocol<T extends KnownProtocol> =
  (typeof knownProtocols)[T] extends { withSsl: KnownProtocol }
    ? BasePortOptions<T> &
        ({ noAddSsl: true } | { addSsl?: Partial<AddSslOptions> })
    : BasePortOptions<T> & { addSsl?: AddSslOptions | null }
type OldPortOptionsByProtocol<T extends string> = T extends KnownProtocol
  ? OldPortOptionsByKnownProtocol<T>
  : PortOptions

type PortOptionsByKnownProtocol =
  | ({
      protocol: SslProtocols
      preferredExternalPort?: number
      scheme?: Scheme
    } & ({ noAddSsl: true } | { addSsl?: Partial<AddSslOptions> }))
  | {
      protocol: NotSslProtocols
      preferredExternalPort?: number
      scheme?: Scheme
      addSsl?: AddSslOptions | null
    }
type PortOptionsByProtocol = PortOptionsByKnownProtocol | PortOptions

function isForKnownProtocol(
  options: PortOptionsByProtocol,
): options is PortOptionsByKnownProtocol {
  return "protocol" in options && options.protocol in knownProtocols
}

const TRUE_DEFAULT = {
  preferredExternalPort: 443,
  scheme: "https",
}

export class Host {
  constructor(
    readonly kind: "static" | "single" | "multi",
    readonly options: {
      effects: Effects
      id: string
    },
  ) {}

  async bindPort(
    internalPort: number,
    options: PortOptionsByProtocol,
  ): Promise<Origin<this>> {
    if (isForKnownProtocol(options)) {
      return await this.bindPortForKnown(options, internalPort)
    } else {
      return await this.bindPortForUnknown(internalPort, options)
    }
  }

  private async bindPortForUnknown(
    internalPort: number,
    options:
      | ({
          scheme: Scheme
          preferredExternalPort: number
          addSsl: AddSslOptions | null
        } & { secure: false; ssl: false })
      | ({
          scheme: Scheme
          preferredExternalPort: number
          addSsl: AddSslOptions | null
        } & { secure: true; ssl: boolean }),
  ) {
    await this.options.effects.bind({
      kind: this.kind,
      id: this.options.id,
      internalPort: internalPort,
      ...options,
    })

    return new Origin(this, options)
  }

  private async bindPortForKnown(
    options: PortOptionsByKnownProtocol,
    internalPort: number,
  ) {
    const scheme =
      options.scheme === undefined ? options.protocol : options.scheme
    const protoInfo = knownProtocols[options.protocol]
    const preferredExternalPort =
      options.preferredExternalPort ||
      knownProtocols[options.protocol].defaultPort
    const defaultAddSsl = this.bindPortForKnownDefaulAddSsl(options, protoInfo)
    const addSsl =
      "addSsl" in options
        ? { ...defaultAddSsl, ...options.addSsl }
        : defaultAddSsl
    const security: Security = !protoInfo.secure
      ? {
          secure: protoInfo.secure,
          ssl: protoInfo.ssl,
        }
      : { secure: false, ssl: false }

    const newOptions = {
      scheme,
      preferredExternalPort,
      addSsl,
      ...security,
    }

    await this.options.effects.bind({
      kind: this.kind,
      id: this.options.id,
      internalPort,
      ...newOptions,
    })

    return new Origin(this, newOptions)
  }

  private bindPortForKnownDefaulAddSsl(
    options: PortOptionsByKnownProtocol,
    protoInfo:
      | {
          readonly secure: false
          readonly ssl: false
          readonly defaultPort: 80
          readonly withSsl: "https"
        }
      | { readonly secure: true; readonly ssl: true; readonly defaultPort: 443 }
      | {
          readonly secure: false
          readonly ssl: false
          readonly defaultPort: 80
          readonly withSsl: "wss"
        }
      | { readonly secure: true; readonly ssl: true; readonly defaultPort: 443 }
      | { readonly secure: true; readonly ssl: false; readonly defaultPort: 22 }
      | {
          readonly secure: true
          readonly ssl: false
          readonly defaultPort: 8333
        }
      | {
          readonly secure: true
          readonly ssl: true
          readonly defaultPort: 50051
        }
      | {
          readonly secure: true
          readonly ssl: false
          readonly defaultPort: 53
        },
  ) {
    if ("noAddSsl" in options && options.noAddSsl) return TRUE_DEFAULT
    if ("withSsl" in protoInfo)
      return {
        preferredExternalPort: knownProtocols[protoInfo.withSsl].defaultPort,
        scheme: protoInfo.withSsl,
      }
    return TRUE_DEFAULT
  }
}

export class StaticHost extends Host {
  constructor(options: { effects: Effects; id: string }) {
    super("static", options)
  }
}

export class SingleHost extends Host {
  constructor(options: { effects: Effects; id: string }) {
    super("single", options)
  }
}

export class MultiHost extends Host {
  constructor(options: { effects: Effects; id: string }) {
    super("multi", options)
  }
}

async function test(effects: Effects) {
  const foo = new MultiHost({ effects, id: "foo" })
  const fooOrigin = await foo.bindPort(80, { protocol: "http" as const })
  const fooInterface = new NetworkInterfaceBuilder({
    effects,
    name: "Foo",
    id: "foo",
    description: "A Foo",
    ui: true,
    username: "bar",
    path: "/baz",
    search: { qux: "yes" },
  })

  await fooInterface.export([fooOrigin])
}
