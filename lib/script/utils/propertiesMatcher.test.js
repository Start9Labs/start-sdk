"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dntShim = __importStar(require("../_dnt.test_shims.js"));
const PM = __importStar(require("./propertiesMatcher.js"));
const mod_js_1 = require("../deps/deno.land/x/expect@v0.2.9/mod.js");
const dependencies_js_1 = require("../dependencies.js");
const output_js_1 = require("./test/output.js");
const randWithSeed = (seed = 1) => {
    return function random() {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };
};
const bitcoinProperties = output_js_1.config.build();
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
        (0, mod_js_1.expect)(checker.test(0)).toBe(false);
        (0, mod_js_1.expect)(checker.test(1)).toBe(false);
        (0, mod_js_1.expect)(checker.test(2)).toBe(true);
        (0, mod_js_1.expect)(checker.test(3)).toBe(true);
        (0, mod_js_1.expect)(checker.test(4)).toBe(false);
        (0, mod_js_1.expect)(checker.test(5)).toBe(false);
    });
    test("matchNumberWithRange [1,4]", () => {
        const checker = PM.matchNumberWithRange("[1,4]");
        (0, mod_js_1.expect)(checker.test(0)).toBe(false);
        (0, mod_js_1.expect)(checker.test(1)).toBe(true);
        (0, mod_js_1.expect)(checker.test(2)).toBe(true);
        (0, mod_js_1.expect)(checker.test(3)).toBe(true);
        (0, mod_js_1.expect)(checker.test(4)).toBe(true);
        (0, mod_js_1.expect)(checker.test(5)).toBe(false);
    });
    test("matchNumberWithRange [1,*)", () => {
        const checker = PM.matchNumberWithRange("[1,*)");
        (0, mod_js_1.expect)(checker.test(0)).toBe(false);
        (0, mod_js_1.expect)(checker.test(1)).toBe(true);
        (0, mod_js_1.expect)(checker.test(2)).toBe(true);
        (0, mod_js_1.expect)(checker.test(3)).toBe(true);
        (0, mod_js_1.expect)(checker.test(4)).toBe(true);
        (0, mod_js_1.expect)(checker.test(5)).toBe(true);
    });
    test("matchNumberWithRange (*,4]", () => {
        const checker = PM.matchNumberWithRange("(*,4]");
        (0, mod_js_1.expect)(checker.test(0)).toBe(true);
        (0, mod_js_1.expect)(checker.test(1)).toBe(true);
        (0, mod_js_1.expect)(checker.test(2)).toBe(true);
        (0, mod_js_1.expect)(checker.test(3)).toBe(true);
        (0, mod_js_1.expect)(checker.test(4)).toBe(true);
        (0, mod_js_1.expect)(checker.test(5)).toBe(false);
    });
}
{
    test("Generate 1", () => {
        const random = randWithSeed(1);
        const options = { random };
        const generated = PM.generateDefault({ charset: "a-z,B-X,2-5", len: 100 }, options);
        (0, mod_js_1.expect)(generated.length).toBe(100);
        (0, mod_js_1.expect)(generated).toBe("WwwgjGRkvDaGQSLeKTtlOmdDbXoCBkOn3dxUvkKkrlOFd4FbKuvIosvfPTQhbWCTQakqnwpoHmPnbgyK5CGtSQyGhxEGLjS3oKko");
    });
    test("Generate Tests", () => {
        const random = randWithSeed(2);
        const options = { random };
        (0, mod_js_1.expect)(PM.generateDefault({ charset: "0-1", len: 100 }, options)).toBe("0000110010000000000011110000010010000011101111001000000000000000100001101000010000001000010000010110");
        (0, mod_js_1.expect)(PM.generateDefault({ charset: "a-z", len: 100 }, options)).toBe("qipnycbqmqdtflrhnckgrhftrqnvxbhyyfehpvficljseasxwdyleacmjqemmpnuotkwzlsqdumuaaksxykchljgdoslrfubhepr");
        (0, mod_js_1.expect)(PM.generateDefault({ charset: "a,b,c,d,f,g", len: 100 }, options))
            .toBe("bagbafcgaaddcabdfadccaadfbddffdcfccfbafbddbbfcdggfcgaffdbcgcagcfbdbfaagbfgfccdbfdfbdagcfdcabbdffaffc");
    });
}
{
    test("Specs Union", () => {
        const checker = PM.guardAll(bitcoinProperties.advanced.spec.pruning);
        console.log("Checker = ", dependencies_js_1.matches.Parser.parserAsString(checker.parser));
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
        (0, mod_js_1.expect)(() => checker.unsafeCast({
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
        (0, mod_js_1.expect)(() => checker.unsafeCast({
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
        (0, mod_js_1.expect)(() => checker.unsafeCast({
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
