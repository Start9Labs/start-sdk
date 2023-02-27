import * as dntShim from "../_dnt.test_shims.js";
import * as PM from "./propertiesMatcher.js";
import { expect } from "../deps/deno.land/x/expect@v0.2.9/mod.js";
import { matches } from "../dependencies.js";
import { config as bitcoinPropertiesConfig } from "./test/output.js";
const randWithSeed = (seed = 1) => {
    return function random() {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };
};
const bitcoinProperties = bitcoinPropertiesConfig.build();
const anyValue = "";
const _testBoolean = anyValue;
// @ts-expect-error Boolean can't be a string
const _testBooleanBad = anyValue;
const _testString = anyValue;
// @ts-expect-error string can't be a boolean
const _testStringBad = anyValue;
const _testNumber = anyValue;
// @ts-expect-error Number can't be string
const _testNumberBad = anyValue;
const _testObject = anyValue;
// @ts-expect-error Boolean can't be object
const _testObjectBad = anyValue;
const _testObjectNested = anyValue;
const _testList = anyValue;
// @ts-expect-error number[] can't be string[]
const _testListBad = anyValue;
const _testPointer = anyValue;
const testUnionValue = anyValue;
const _testUnion = testUnionValue;
//@ts-expect-error Bad mode name
const _testUnionBadUnion = testUnionValue;
const _testAll = anyValue;
const { test } = dntShim.Deno;
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
        expect(generated).toBe("WwwgjGRkvDaGQSLeKTtlOmdDbXoCBkOn3dxUvkKkrlOFd4FbKuvIosvfPTQhbWCTQakqnwpoHmPnbgyK5CGtSQyGhxEGLjS3oKko");
    });
    test("Generate Tests", () => {
        const random = randWithSeed(2);
        const options = { random };
        expect(PM.generateDefault({ charset: "0-1", len: 100 }, options)).toBe("0000110010000000000011110000010010000011101111001000000000000000100001101000010000001000010000010110");
        expect(PM.generateDefault({ charset: "a-z", len: 100 }, options)).toBe("qipnycbqmqdtflrhnckgrhftrqnvxbhyyfehpvficljseasxwdyleacmjqemmpnuotkwzlsqdumuaaksxykchljgdoslrfubhepr");
        expect(PM.generateDefault({ charset: "a,b,c,d,f,g", len: 100 }, options))
            .toBe("bagbafcgaaddcabdfadccaadfbddffdcfccfbafbddbbfcdggfcgaffdbcgcagcfbdbfaagbfgfccdbfdfbdagcfdcabbdffaffc");
    });
}
{
    test("Specs Union", () => {
        const checker = PM.guardAll(bitcoinProperties.advanced.spec.pruning);
        console.log("Checker = ", matches.Parser.parserAsString(checker.parser));
        checker.unsafeCast({ mode: "automatic", size: 1234 });
    });
    test("A default that is invalid according to the tests", () => {
        const checker = PM.typeFromProps({
            pubkey_whitelist: {
                name: "Pubkey Whitelist (hex)",
                description: "A list of pubkeys that are permitted to publish through your relay. A minimum, you need to enter your own Nostr hex (not npub) pubkey. Go to https://damus.io/key/ to convert from npub to hex.",
                type: "list",
                range: "[1,*)",
                subtype: "string",
                spec: {
                    masked: false,
                    placeholder: "hex (not npub) pubkey",
                    pattern: "[0-9a-fA-F]{3}",
                    "pattern-description": "Must be a valid 64-digit hexadecimal value (ie a Nostr hex pubkey, not an npub). Go to https://damus.io/key/ to convert npub to hex.",
                },
                default: [],
                warning: null,
            },
        });
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
        expect(() => checker.unsafeCast({
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
        })).toThrow();
        expect(() => checker.unsafeCast({
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
        })).toThrow();
        expect(() => checker.unsafeCast({
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
        })).toThrow();
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
