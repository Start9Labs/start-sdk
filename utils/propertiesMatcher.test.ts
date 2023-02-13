import * as PM from "./propertiesMatcher.ts";
import { expect } from "https://deno.land/x/expect@v0.2.9/mod.ts";
import { matches } from "../dependencies.ts";

const randWithSeed = (seed = 1) => {
  return function random() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
};
const bitcoinProperties = {
  "peer-tor-address": {
    name: "Peer Tor Address",
    description: "The Tor address of the peer interface",
    type: "pointer",
    subtype: "package",
    "package-id": "bitcoind",
    target: "tor-address",
    interface: "peer",
  },
  "rpc-tor-address": {
    name: "RPC Tor Address",
    description: "The Tor address of the RPC interface",
    type: "pointer",
    subtype: "package",
    "package-id": "bitcoind",
    target: "tor-address",
    interface: "rpc",
  },
  rpc: {
    type: "object",
    name: "RPC Settings",
    description: "RPC configuration options.",
    spec: {
      enable: {
        type: "boolean",
        name: "Enable",
        description: "Allow remote RPC requests.",
        default: true,
      },
      username: {
        type: "string",
        nullable: false,
        name: "Username",
        description: "The username for connecting to Bitcoin over RPC.",
        default: "bitcoin",
        masked: true,
        pattern: "^[a-zA-Z0-9_]+$",
        "pattern-description": "Must be alphanumeric (can contain underscore).",
      },
      password: {
        type: "string",
        nullable: false,
        name: "RPC Password",
        description: "The password for connecting to Bitcoin over RPC.",
        default: {
          charset: "a-z,2-7",
          len: 20,
        },
        pattern: '^[^\\n"]*$',
        "pattern-description": "Must not contain newline or quote characters.",
        copyable: true,
        masked: true,
      },
      advanced: {
        type: "object",
        name: "Advanced",
        description: "Advanced RPC Settings",
        spec: {
          auth: {
            name: "Authorization",
            description:
              "Username and hashed password for JSON-RPC connections. RPC clients connect using the usual http basic authentication.",
            type: "list",
            subtype: "string",
            default: Array<string>(),
            spec: {
              pattern: "^[a-zA-Z0-9_-]+:([0-9a-fA-F]{2})+\\$([0-9a-fA-F]{2})+$",
              "pattern-description": 'Each item must be of the form "<USERNAME>:<SALT>$<HASH>".',
            },
            range: "[0,*)",
          },
          serialversion: {
            name: "Serialization Version",
            description: "Return raw transaction or block hex with Segwit or non-SegWit serialization.",
            type: "enum",
            values: ["non-segwit", "segwit"],
            "value-names": {},
            default: "segwit",
          },
          servertimeout: {
            name: "Rpc Server Timeout",
            description: "Number of seconds after which an uncompleted RPC call will time out.",
            type: "number",
            nullable: false,
            range: "[5,300]",
            integral: true,
            units: "seconds",
            default: 30,
          },
          threads: {
            name: "Threads",
            description:
              "Set the number of threads for handling RPC calls. You may wish to increase this if you are making lots of calls via an integration.",
            type: "number",
            nullable: false,
            default: 16,
            range: "[1,64]",
            integral: true,
            units: undefined,
          },
          workqueue: {
            name: "Work Queue",
            description:
              "Set the depth of the work queue to service RPC calls. Determines how long the backlog of RPC requests can get before it just rejects new ones.",
            type: "number",
            nullable: false,
            default: 128,
            range: "[8,256]",
            integral: true,
            units: "requests",
          },
        },
      },
    },
  },
  "zmq-enabled": {
    type: "boolean",
    name: "ZeroMQ Enabled",
    description: "Enable the ZeroMQ interface",
    default: true,
  },
  txindex: {
    type: "boolean",
    name: "Transaction Index",
    description: "Enable the Transaction Index (txindex)",
    default: true,
  },
  wallet: {
    type: "object",
    name: "Wallet",
    description: "Wallet Settings",
    spec: {
      enable: {
        name: "Enable Wallet",
        description: "Load the wallet and enable wallet RPC calls.",
        type: "boolean",
        default: true,
      },
      avoidpartialspends: {
        name: "Avoid Partial Spends",
        description:
          "Group outputs by address, selecting all or none, instead of selecting on a per-output basis. This improves privacy at the expense of higher transaction fees.",
        type: "boolean",
        default: true,
      },
      discardfee: {
        name: "Discard Change Tolerance",
        description:
          "The fee rate (in BTC/kB) that indicates your tolerance for discarding change by adding it to the fee.",
        type: "number",
        nullable: false,
        default: 0.0001,
        range: "[0,.01]",
        integral: false,
        units: "BTC/kB",
      },
    },
  },
  advanced: {
    type: "object",
    name: "Advanced",
    description: "Advanced Settings",
    spec: {
      mempool: {
        type: "object",
        name: "Mempool",
        description: "Mempool Settings",
        spec: {
          mempoolfullrbf: {
            name: "Enable Full RBF",
            description:
              "Policy for your node to use for relaying and mining unconfirmed transactions.  For details, see https://github.com/bitcoin/bitcoin/blob/master/doc/release-notes/release-notes-24.0.md#notice-of-new-option-for-transaction-replacement-policies",
            type: "boolean",
            default: false,
          },
          persistmempool: {
            type: "boolean",
            name: "Persist Mempool",
            description: "Save the mempool on shutdown and load on restart.",
            default: true,
          },
          maxmempool: {
            type: "number",
            nullable: false,
            name: "Max Mempool Size",
            description: "Keep the transaction memory pool below <n> megabytes.",
            range: "[1,*)",
            integral: true,
            units: "MiB",
            default: 300,
          },
          mempoolexpiry: {
            type: "number",
            nullable: false,
            name: "Mempool Expiration",
            description: "Do not keep transactions in the mempool longer than <n> hours.",
            range: "[1,*)",
            integral: true,
            units: "Hr",
            default: 336,
          },
        },
      },
      peers: {
        type: "object",
        name: "Peers",
        description: "Peer Connection Settings",
        spec: {
          listen: {
            type: "boolean",
            name: "Make Public",
            description: "Allow other nodes to find your server on the network.",
            default: true,
          },
          onlyconnect: {
            type: "boolean",
            name: "Disable Peer Discovery",
            description: "Only connect to specified peers.",
            default: false,
          },
          onlyonion: {
            type: "boolean",
            name: "Disable Clearnet",
            description: "Only connect to peers over Tor.",
            default: false,
          },
          addnode: {
            name: "Add Nodes",
            description: "Add addresses of nodes to connect to.",
            type: "list",
            subtype: "object",
            range: "[0,*)",
            default: Array<Record<string, unknown>>(),
            spec: {
              spec: {
                hostname: {
                  type: "string",
                  nullable: false,
                  name: "Hostname",
                  description: "Domain or IP address of bitcoin peer",
                  pattern:
                    "(^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$)|((^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$)|(^[a-z2-7]{16}\\.onion$)|(^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$))",
                  "pattern-description":
                    "Must be either a domain name, or an IPv4 or IPv6 address. Do not include protocol scheme (eg 'http://') or port.",
                },
                port: {
                  type: "number",
                  nullable: true,
                  name: "Port",
                  description: "Port that peer is listening on for inbound p2p connections",
                  range: "[0,65535]",
                  integral: true,
                },
              },
            },
          },
        },
      },
      dbcache: {
        type: "number",
        nullable: true,
        name: "Database Cache",
        description:
          "How much RAM to allocate for caching the TXO set. Higher values improve syncing performance, but increase your chance of using up all your system's memory or corrupting your database in the event of an ungraceful shutdown. Set this high but comfortably below your system's total RAM during IBD, then turn down to 450 (or leave blank) once the sync completes.",
        warning:
          "WARNING: Increasing this value results in a higher chance of ungraceful shutdowns, which can leave your node unusable if it happens during the initial block download. Use this setting with caution. Be sure to set this back to the default (450 or leave blank) once your node is synced. DO NOT press the STOP button if your dbcache is large. Instead, set this number back to the default, hit save, and wait for bitcoind to restart on its own.",
        range: "(0,*)",
        integral: true,
        units: "MiB",
      },
      pruning: {
        type: "union",
        name: "Pruning Settings",
        description: "Blockchain Pruning Options\nReduce the blockchain size on disk\n",
        warning:
          "If you set pruning to Manual and your disk is smaller than the total size of the blockchain, you MUST have something running that prunes these blocks or you may overfill your disk!\nDisabling pruning will convert your node into a full archival node. This requires a resync of the entire blockchain, a process that may take several days. Make sure you have enough free disk space or you may fill up your disk.\n",
        tag: {
          id: "mode",
          name: "Pruning Mode",
          description:
            '- Disabled: Disable pruning\n- Automatic: Limit blockchain size on disk to a certain number of megabytes\n- Manual: Prune blockchain with the "pruneblockchain" RPC\n',
          "variant-names": {
            disabled: "Disabled",
            automatic: "Automatic",
            manual: "Manual",
          },
        },
        variants: {
          disabled: {},
          automatic: {
            size: {
              type: "number",
              nullable: false,
              name: "Max Chain Size",
              description: "Limit of blockchain size on disk.",
              warning: "Increasing this value will require re-syncing your node.",
              default: 550,
              range: "[550,1000000)",
              integral: true,
              units: "MiB",
            },
          },
          manual: {
            size: {
              type: "number",
              nullable: false,
              name: "Failsafe Chain Size",
              description: "Prune blockchain if size expands beyond this.",
              default: 65536,
              range: "[550,1000000)",
              integral: true,
              units: "MiB",
            },
          },
        },
        default: "disabled",
      },
      blockfilters: {
        type: "object",
        name: "Block Filters",
        description: "Settings for storing and serving compact block filters",
        spec: {
          blockfilterindex: {
            type: "boolean",
            name: "Compute Compact Block Filters (BIP158)",
            description:
              "Generate Compact Block Filters during initial sync (IBD) to enable 'getblockfilter' RPC. This is useful if dependent services need block filters to efficiently scan for addresses/transactions etc.",
            default: true,
          },
          peerblockfilters: {
            type: "boolean",
            name: "Serve Compact Block Filters to Peers (BIP157)",
            description:
              "Serve Compact Block Filters as a peer service to other nodes on the network. This is useful if you wish to connect an SPV client to your node to make it efficient to scan transactions without having to download all block data.  'Compute Compact Block Filters (BIP158)' is required.",
            default: false,
          },
        },
      },
      bloomfilters: {
        type: "object",
        name: "Bloom Filters (BIP37)",
        description: "Setting for serving Bloom Filters",
        spec: {
          peerbloomfilters: {
            type: "boolean",
            name: "Serve Bloom Filters to Peers",
            description:
              "Peers have the option of setting filters on each connection they make after the version handshake has completed. Bloom filters are for clients implementing SPV (Simplified Payment Verification) that want to check that block headers  connect together correctly, without needing to verify the full blockchain.  The client must trust that the transactions in the chain are in fact valid.  It is highly recommended AGAINST using for anything except Bisq integration.",
            warning: "This is ONLY for use with Bisq integration, please use Block Filters for all other applications.",
            default: false,
          },
        },
      },
    },
    matches,
  },
} as const;
type BitcoinProperties = typeof bitcoinProperties;
const anyValue: unknown = "";
const _testBoolean: boolean = anyValue as PM.GuardAll<BitcoinProperties["rpc"]["spec"]["enable"]>;
// @ts-expect-error Boolean can't be a string
const _testBooleanBad: string = anyValue as PM.GuardAll<BitcoinProperties["rpc"]["spec"]["enable"]>;
const _testString: string = anyValue as PM.GuardAll<BitcoinProperties["rpc"]["spec"]["username"]>;
// @ts-expect-error string can't be a boolean
const _testStringBad: boolean = anyValue as PM.GuardAll<BitcoinProperties["rpc"]["spec"]["username"]>;
const _testNumber: number = anyValue as PM.GuardAll<BitcoinProperties["advanced"]["spec"]["dbcache"]>;
// @ts-expect-error Number can't be string
const _testNumberBad: string = anyValue as PM.GuardAll<BitcoinProperties["advanced"]["spec"]["dbcache"]>;
const _testObject: {
  enable: boolean;
  avoidpartialspends: boolean;
  discardfee: number;
} = anyValue as PM.GuardAll<BitcoinProperties["wallet"]>;
// @ts-expect-error Boolean can't be object
const _testObjectBad: boolean = anyValue as PM.GuardAll<BitcoinProperties["wallet"]>;
const _testObjectNested: { test: { a: boolean } } = anyValue as PM.GuardAll<{
  readonly type: "object";
  readonly spec: {
    readonly test: {
      readonly type: "object";
      readonly spec: {
        readonly a: {
          readonly type: "boolean";
        };
      };
    };
  };
}>;
const _testList: readonly string[] = anyValue as PM.GuardAll<{
  type: "list";
  subtype: "string";
  default: [];
}>;
// @ts-expect-error number[] can't be string[]
const _testListBad: readonly number[] = anyValue as PM.GuardAll<{
  type: "list";
  subtype: "string";
  default: [];
}>;
const _testPointer: { _UNKNOWN: "Pointer" } = anyValue as PM.GuardAll<{
  type: "pointer";
}>;
const testUnionValue = anyValue as PM.GuardAll<{
  type: "union";
  tag: {
    id: "mode";
    name: "Pruning Mode";
    description: '- Disabled: Disable pruning\n- Automatic: Limit blockchain size on disk to a certain number of megabytes\n- Manual: Prune blockchain with the "pruneblockchain" RPC\n';
    "variant-names": {
      disabled: "Disabled";
      automatic: "Automatic";
      manual: "Manual";
    };
  };
  variants: {
    disabled: Record<string, never>;
    automatic: {
      size: {
        type: "number";
        nullable: false;
        name: "Max Chain Size";
        description: "Limit of blockchain size on disk.";
        warning: "Increasing this value will require re-syncing your node.";
        default: 550;
        range: "[550,1000000)";
        integral: true;
        units: "MiB";
      };
    };
    manual: {
      size: {
        type: "number";
        nullable: false;
        name: "Failsafe Chain Size";
        description: "Prune blockchain if size expands beyond this.";
        default: 65536;
        range: "[550,1000000)";
        integral: true;
        units: "MiB";
      };
    };
  };
  default: "disabled";
}>;
const _testUnion:
  | { mode: "disabled" }
  | { mode: "automatic"; size: number }
  | {
      mode: "manual";
      size: number;
    } = testUnionValue;
//@ts-expect-error Bad mode name
const _testUnionBadUnion:
  | { mode: "disabled" }
  | { mode: "bad"; size: number }
  | {
      mode: "manual";
      size: number;
    } = testUnionValue;
const _testAll: PM.TypeFromProps<BitcoinProperties> = anyValue as {
  // deno-lint-ignore no-explicit-any
  "peer-tor-address": any;
  // deno-lint-ignore no-explicit-any
  "rpc-tor-address": any;
  rpc: {
    enable: boolean;
    username: string;
    password: string;
    advanced: {
      auth: string[];
      serialversion: "non-segwit" | "segwit";
      servertimeout: number;
      threads: number;
      workqueue: number;
    };
  };

  "zmq-enabled": boolean;
  txindex: boolean;
  wallet: {
    enable: boolean;
    avoidpartialspends: boolean;
    discardfee: number;
  };
  advanced: {
    mempool: {
      mempoolfullrbf: boolean;
      persistmempool: boolean;
      maxmempool: number;
      mempoolexpiry: number;
    };
    peers: {
      listen: boolean;
      onlyconnect: boolean;
      onlyonion: boolean;
      addnode: readonly { hostname: string; port: number }[];
    };
    dbcache: number;
    pruning:
      | { mode: "disabled" }
      | { mode: "automatic"; size: number }
      | {
          mode: "manual";
          size: number;
        };
    blockfilters: {
      blockfilterindex: boolean;
      peerblockfilters: boolean;
    };
    bloomfilters: {
      peerbloomfilters: boolean;
    };
  };
};

const { test } = Deno;

{
  test("matchNumberWithRange (1,4)", () => {
    const checker = PM.matchNumberWithRange("(1,4)");
    expect(checker.test(0)).toBe(false);
    expect(checker.test(1)).toBe(false);
    expect(checker.test(2)).toBe(true);
    expect(checker.test(3)).toBe(true);
    expect(checker.test(4)).toBe(false);
    expect(checker.test(5)).toBe(false);
  });
  test("matchNumberWithRange [1,4]", () => {
    const checker = PM.matchNumberWithRange("[1,4]");
    expect(checker.test(0)).toBe(false);
    expect(checker.test(1)).toBe(true);
    expect(checker.test(2)).toBe(true);
    expect(checker.test(3)).toBe(true);
    expect(checker.test(4)).toBe(true);
    expect(checker.test(5)).toBe(false);
  });
  test("matchNumberWithRange [1,*)", () => {
    const checker = PM.matchNumberWithRange("[1,*)");
    expect(checker.test(0)).toBe(false);
    expect(checker.test(1)).toBe(true);
    expect(checker.test(2)).toBe(true);
    expect(checker.test(3)).toBe(true);
    expect(checker.test(4)).toBe(true);
    expect(checker.test(5)).toBe(true);
  });
  test("matchNumberWithRange (*,4]", () => {
    const checker = PM.matchNumberWithRange("(*,4]");
    expect(checker.test(0)).toBe(true);
    expect(checker.test(1)).toBe(true);
    expect(checker.test(2)).toBe(true);
    expect(checker.test(3)).toBe(true);
    expect(checker.test(4)).toBe(true);
    expect(checker.test(5)).toBe(false);
  });
}

{
  test("Generate 1", () => {
    const random = randWithSeed(1);
    const options = { random };
    const generated = PM.generateDefault({ charset: "a-z,B-X,2-5", len: 100 }, options);
    expect(generated.length).toBe(100);
    expect(generated).toBe(
      "WwwgjGRkvDaGQSLeKTtlOmdDbXoCBkOn3dxUvkKkrlOFd4FbKuvIosvfPTQhbWCTQakqnwpoHmPnbgyK5CGtSQyGhxEGLjS3oKko"
    );
  });
  test("Generate Tests", () => {
    const random = randWithSeed(2);
    const options = { random };
    expect(PM.generateDefault({ charset: "0-1", len: 100 }, options)).toBe(
      "0000110010000000000011110000010010000011101111001000000000000000100001101000010000001000010000010110"
    );
    expect(PM.generateDefault({ charset: "a-z", len: 100 }, options)).toBe(
      "qipnycbqmqdtflrhnckgrhftrqnvxbhyyfehpvficljseasxwdyleacmjqemmpnuotkwzlsqdumuaaksxykchljgdoslrfubhepr"
    );
    expect(PM.generateDefault({ charset: "a,b,c,d,f,g", len: 100 }, options)).toBe(
      "bagbafcgaaddcabdfadccaadfbddffdcfccfbafbddbbfcdggfcgaffdbcgcagcfbdbfaagbfgfccdbfdfbdagcfdcabbdffaffc"
    );
  });
}

{
  test("Specs Union", () => {
    const checker = PM.guardAll(bitcoinProperties.advanced.spec.pruning);
    console.log("Checker = ", matches.Parser.parserAsString(checker.parser));
    checker.unsafeCast({ mode: "automatic", size: 1234 });
  });

  test("Something that broke", () => {
    const checker = PM.typeFromProps({
      pubkey_whitelist: {
        name: "Pubkey Whitelist (hex)",
        description:
          "A list of pubkeys that are permitted to publish through your relay. A minimum, you need to enter your own Nostr hex (not npub) pubkey. Go to https://damus.io/key/ to convert from npub to hex.",
        type: "list",
        nullable: true,
        range: "[1,*)",
        subtype: "string",
        spec: {
          placeholder: "hex (not npub) pubkey",
          pattern: "[0-9a-fA-F]{3}",
          "pattern-description":
            "Must be a valid 64-digit hexadecimal value (ie a Nostr hex pubkey, not an npub). Go to https://damus.io/key/ to convert npub to hex.",
        },
        default: [] as string[], // [] as string []
      },
    } as const);

    checker.unsafeCast({
      pubkey_whitelist: ["aaa"],
    });
  });

  test("Full spec", () => {
    const checker = PM.typeFromProps(bitcoinProperties);

    checker.unsafeCast({
      "peer-tor-address": "",
      "rpc-tor-address": "",
      rpc: {
        enable: true,
        username: "asdf",
        password: "asdf",
        advanced: {
          auth: ["test:34$aa"],
          serialversion: "non-segwit",
          servertimeout: 12,
          threads: 12,
          workqueue: 12,
        },
      },
      "zmq-enabled": false,
      txindex: false,
      wallet: {
        enable: true,
        avoidpartialspends: false,
        discardfee: 0,
      },
      advanced: {
        mempool: {
          mempoolfullrbf: false,
          persistmempool: false,
          maxmempool: 3012,
          mempoolexpiry: 321,
        },
        peers: {
          listen: false,
          onlyconnect: false,
          onlyonion: false,
          addnode: [{ hostname: "google.com", port: 231 }],
        },
        dbcache: 123,
        pruning: { mode: "automatic", size: 1234 },
        blockfilters: {
          blockfilterindex: false,
          peerblockfilters: false,
        },
        bloomfilters: {
          peerbloomfilters: false,
        },
      },
    });

    expect(() =>
      checker.unsafeCast({
        "peer-tor-address": "",
        "rpc-tor-address": "",
        rpc: {
          enable: true,
          username: "asdf",
          password: "asdf",
          advanced: {
            auth: ["test:34$aa"],
            serialversion: "non-segwit",
            servertimeout: 12,
            threads: 12,
            workqueue: 12,
          },
        },
        "zmq-enabled": false,
        txindex: false,
        wallet: {
          enable: true,
          avoidpartialspends: false,
          discardfee: 0,
        },
        advanced: {
          mempool: {
            mempoolfullrbf: false,
            persistmempool: false,
            maxmempool: 3012,
            mempoolexpiry: 321,
          },
          peers: {
            listen: false,
            onlyconnect: false,
            onlyonion: false,
            addnode: [{ hostname: "google", port: 231 }],
          },
          dbcache: 123,
          pruning: { mode: "automatic", size: 1234 },
          blockfilters: {
            blockfilterindex: false,
            peerblockfilters: false,
          },
          bloomfilters: {
            peerbloomfilters: false,
          },
        },
      })
    ).toThrow();

    expect(() =>
      checker.unsafeCast({
        "peer-tor-address": "",
        "rpc-tor-address": "",
        rpc: {
          enable: true,
          username: "asdf",
          password: "asdf",
          advanced: {
            auth: ["test34$aa"],
            serialversion: "non-segwit",
            servertimeout: 12,
            threads: 12,
            workqueue: 12,
          },
        },
        "zmq-enabled": false,
        txindex: false,
        wallet: {
          enable: true,
          avoidpartialspends: false,
          discardfee: 0,
        },
        advanced: {
          mempool: {
            mempoolfullrbf: false,
            persistmempool: false,
            maxmempool: 3012,
            mempoolexpiry: 321,
          },
          peers: {
            listen: false,
            onlyconnect: false,
            onlyonion: false,
            addnode: [{ hostname: "google.com", port: 231 }],
          },
          dbcache: 123,
          pruning: { mode: "automatic", size: 1234 },
          blockfilters: {
            blockfilterindex: false,
            peerblockfilters: false,
          },
          bloomfilters: {
            peerbloomfilters: false,
          },
        },
      })
    ).toThrow();

    expect(() =>
      checker.unsafeCast({
        "peer-tor-address": "",
        "rpc-tor-address": "",
        rpc: {
          enable: true,
          username: "asdf",
          password: "asdf",
          advanced: {
            auth: ["test:34$aa"],
            serialversion: "non-segwit",
            servertimeout: 12,
            threads: 12,
            workqueue: 12,
          },
        },
        "zmq-enabled": false,
        txindex: false,
        wallet: {
          enable: true,
          avoidpartialspends: false,
          discardfee: 0,
        },
        advanced: {
          mempool: {
            mempoolfullrbf: false,
            persistmempool: false,
            maxmempool: 3012,
            mempoolexpiry: 321,
          },
          peers: {
            listen: false,
            onlyconnect: false,
            onlyonion: false,
            addnode: [{ hostname: "google.com", port: 231 }],
          },
          dbcache: 123,
          pruning: { mode: "automatic", size: "1234" },
          blockfilters: {
            blockfilterindex: false,
            peerblockfilters: false,
          },
          bloomfilters: {
            peerbloomfilters: false,
          },
        },
      })
    ).toThrow();
    checker.unsafeCast({
      "peer-tor-address": "",
      "rpc-tor-address": null,
      rpc: {
        enable: true,
        username: "asdf",
        password: "asdf",
        advanced: {
          auth: ["test:34$aa"],
          serialversion: "non-segwit",
          servertimeout: 12,
          threads: 12,
          workqueue: 12,
        },
      },
      "zmq-enabled": false,
      txindex: false,
      wallet: {
        enable: true,
        avoidpartialspends: false,
        discardfee: 0,
      },
      advanced: {
        mempool: {
          mempoolfullrbf: false,
          persistmempool: false,
          maxmempool: 3012,
          mempoolexpiry: 321,
        },
        peers: {
          listen: false,
          onlyconnect: false,
          onlyonion: false,
          addnode: [{ hostname: "google.com", port: 231 }],
        },
        dbcache: 123,
        pruning: { mode: "automatic", size: 1234 },
        blockfilters: {
          blockfilterindex: false,
          peerblockfilters: false,
        },
        bloomfilters: {
          peerbloomfilters: false,
        },
      },
    });
  });
}
