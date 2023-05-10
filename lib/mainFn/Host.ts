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
type PortOptionsByKnownProtocol<T extends KnownProtocol> =
  (typeof knownProtocols)[T] extends { withSsl: KnownProtocol }
    ? BasePortOptions<T> &
        ({ noAddSsl: true } | { addSsl?: Partial<AddSslOptions> })
    : BasePortOptions<T> & { addSsl?: AddSslOptions | null }
type PortOptionsByProtocol<T extends string> = T extends KnownProtocol
  ? PortOptionsByKnownProtocol<T>
  : PortOptions

function isForKnownProtocol(
  options: PortOptionsByProtocol<string> | PortOptionsByProtocol<KnownProtocol>,
): options is PortOptionsByProtocol<KnownProtocol> {
  return "protocol" in options && (options.protocol as string) in knownProtocols
}

export class Host {
  constructor(
    readonly kind: "static" | "single" | "multi",
    readonly options: {
      effects: Effects
      id: string
    },
  ) {}

  async bindPort<T extends string>(
    internalPort: number,
    options: PortOptionsByProtocol<T>,
  ): Promise<Origin<this>> {
    if (isForKnownProtocol(options)) {
      const scheme =
        options.scheme === undefined ? options.protocol : options.scheme
      const protoInfo = knownProtocols[options.protocol]
      const preferredExternalPort =
        options.preferredExternalPort ||
        knownProtocols[options.protocol].defaultPort
      const defaultAddSsl =
        "noAddSsl" in options && options.noAddSsl
          ? null
          : "withSsl" in protoInfo
          ? {
              preferredExternalPort:
                knownProtocols[protoInfo.withSsl].defaultPort,
              scheme: protoInfo.withSsl,
            }
          : null
      const addSsl = options.addSsl
        ? { ...defaultAddSsl, ...options.addSsl }
        : defaultAddSsl
      const security = {
        secure: protoInfo.secure,
        ssl: protoInfo.ssl,
      } as Security

      const newOptions = {
        scheme,
        preferredExternalPort,
        addSsl,
        ...security,
      }

      await this.options.effects.bind({
        kind: this.kind,
        id: this.options.id,
        internalPort: internalPort,
        ...newOptions,
      })

      return new Origin(this, newOptions)
    } else {
      await this.options.effects.bind({
        kind: this.kind,
        id: this.options.id,
        internalPort: internalPort,
        ...options,
      })

      return new Origin(this, options)
    }
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
