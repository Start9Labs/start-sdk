import * as PM from "./propertiesMatcher.ts";
import { expect } from "https://deno.land/x/expect@v0.2.9/mod.ts";
import { matches } from "../dependencies.ts";
import { configSpec as bitcoinPropertiesConfig } from "./test/output.ts";

const randWithSeed = (seed = 1) => {
  return function random() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
};
const bitcoinProperties = bitcoinPropertiesConfig.build();
type BitcoinProperties = typeof bitcoinProperties;
const anyValue: unknown = "";
const _testBoolean: boolean = anyValue as PM.GuardAll<
  BitcoinProperties["rpc"]["spec"]["enable"]
>;
// @ts-expect-error Boolean can't be a string
const _testBooleanBad: string = anyValue as PM.GuardAll<
  BitcoinProperties["rpc"]["spec"]["enable"]
>;
const _testString: string = anyValue as PM.GuardAll<
  BitcoinProperties["rpc"]["spec"]["username"]
>;
// @ts-expect-error string can't be a boolean
const _testStringBad: boolean = anyValue as PM.GuardAll<
  BitcoinProperties["rpc"]["spec"]["username"]
>;
const _testNumber: number = anyValue as PM.GuardAll<
  BitcoinProperties["advanced"]["spec"]["dbcache"]
>;
// @ts-expect-error Number can't be string
const _testNumberBad: string = anyValue as PM.GuardAll<
  BitcoinProperties["advanced"]["spec"]["dbcache"]
>;
const _testObject: {
  enable: boolean;
  avoidpartialspends: boolean;
  discardfee: number;
} = anyValue as PM.GuardAll<BitcoinProperties["wallet"]>;
// @ts-expect-error Boolean can't be object
const _testObjectBad: boolean = anyValue as PM.GuardAll<
  BitcoinProperties["wallet"]
>;
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
const _testPointer: string | null = anyValue as PM.GuardAll<{
  type: "pointer";
}>;
const testUnionValue = anyValue as PM.GuardAll<{
  type: "union";
  tag: {
    id: "mode";
    name: "Pruning Mode";
    warning: null;
    description:
      '- Disabled: Disable pruning\n- Automatic: Limit blockchain size on disk to a certain number of megabytes\n- Manual: Prune blockchain with the "pruneblockchain" RPC\n';
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
        placeholder: null;
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
    const generated = PM.generateDefault(
      { charset: "a-z,B-X,2-5", len: 100 },
      options,
    );
    expect(generated.length).toBe(100);
    expect(generated).toBe(
      "WwwgjGRkvDaGQSLeKTtlOmdDbXoCBkOn3dxUvkKkrlOFd4FbKuvIosvfPTQhbWCTQakqnwpoHmPnbgyK5CGtSQyGhxEGLjS3oKko",
    );
  });
  test("Generate Tests", () => {
    const random = randWithSeed(2);
    const options = { random };
    expect(PM.generateDefault({ charset: "0-1", len: 100 }, options)).toBe(
      "0000110010000000000011110000010010000011101111001000000000000000100001101000010000001000010000010110",
    );
    expect(PM.generateDefault({ charset: "a-z", len: 100 }, options)).toBe(
      "qipnycbqmqdtflrhnckgrhftrqnvxbhyyfehpvficljseasxwdyleacmjqemmpnuotkwzlsqdumuaaksxykchljgdoslrfubhepr",
    );
    expect(PM.generateDefault({ charset: "a,b,c,d,f,g", len: 100 }, options))
      .toBe(
        "bagbafcgaaddcabdfadccaadfbddffdcfccfbafbddbbfcdggfcgaffdbcgcagcfbdbfaagbfgfccdbfdfbdagcfdcabbdffaffc",
      );
  });
}

{
  test("Specs Union", () => {
    const checker = PM.guardAll(bitcoinProperties.advanced.spec.pruning);
    console.log("Checker = ", matches.Parser.parserAsString(checker.parser));
    checker.unsafeCast({ mode: "automatic", size: 1234 });
  });

  test("A default that is invalid according to the tests", () => {
    const checker = PM.typeFromProps(
      {
        pubkey_whitelist: {
          name: "Pubkey Whitelist (hex)",
          description:
            "A list of pubkeys that are permitted to publish through your relay. A minimum, you need to enter your own Nostr hex (not npub) pubkey. Go to https://damus.io/key/ to convert from npub to hex.",
          type: "list",
          range: "[1,*)",
          subtype: "string",
          spec: {
            masked: false,
            placeholder: "hex (not npub) pubkey",
            pattern: "[0-9a-fA-F]{3}",
            "pattern-description":
              "Must be a valid 64-digit hexadecimal value (ie a Nostr hex pubkey, not an npub). Go to https://damus.io/key/ to convert npub to hex.",
          },
          default: [] as string[], // [] as string []
          warning: null,
        },
      } as const,
    );

    checker.unsafeCast({
      pubkey_whitelist: ["aaa"],
    });
  });

  test("Full spec", () => {
    const checker = PM.typeFromProps(bitcoinProperties);

    checker.unsafeCast({
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
