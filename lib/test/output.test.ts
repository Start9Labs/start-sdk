import {
  UnionSelectKey,
  unionSelectKey,
  UnionValueKey,
  unionValueKey,
} from "../config/configTypes";
import { deepMerge } from "../util";
import { InputSpec, matchInputSpec, testListUnion } from "./output";

export type IfEquals<T, U, Y = unknown, N = never> = (<G>() => G extends T
  ? 1
  : 2) extends <G>() => G extends U ? 1 : 2
  ? Y
  : N;
export function testOutput<A, B>(): (c: IfEquals<A, B>) => null {
  return () => null;
}

/// Testing the types of the input spec
testOutput<InputSpec["rpc"]["enable"], boolean>()(null);
// @ts-expect-error Because enable should be a boolean
testOutput<InputSpec["rpc"]["enable"], string>()(null);
testOutput<InputSpec["rpc"]["username"], string>()(null);

testOutput<InputSpec["rpc"]["advanced"]["auth"], string[]>()(null);
testOutput<
  InputSpec["rpc"]["advanced"]["serialversion"],
  "segwit" | "non-segwit"
>()(null);
testOutput<InputSpec["rpc"]["advanced"]["servertimeout"], number>()(null);
testOutput<InputSpec["advanced"]["peers"]["addnode"][0]["hostname"], string>()(
  null,
);
testOutput<
  InputSpec["testListUnion"][0]["union"][UnionValueKey]["name"],
  string
>()(null);
testOutput<InputSpec["testListUnion"][0]["union"][UnionSelectKey], "lnd">()(
  null,
);
// prettier-ignore
// @ts-expect-error Expect that the string is the one above
testOutput<InputSpec["testListUnion"][0][UnionSelectKey][UnionSelectKey], "unionSelectKey">()(null);

/// Here we test the output of the matchInputSpec function
describe("Inputs", () => {
  const validInput: InputSpec = {
    testListUnion: [
      {
        union: { [unionSelectKey]: "lnd", [unionValueKey]: { name: "string" } },
      },
    ],
    rpc: {
      enable: true,
      bio: "This is a bio",
      username: "test",
      password: "test",
      advanced: {
        auth: ["test"],
        serialversion: "segwit",
        servertimeout: 6,
        threads: 3,
        workqueue: 9,
      },
    },
    "zmq-enabled": false,
    txindex: false,
    wallet: { enable: false, avoidpartialspends: false, discardfee: 0.0001 },
    advanced: {
      mempool: {
        maxmempool: 1,
        persistmempool: true,
        mempoolexpiry: 23,
        mempoolfullrbf: true,
      },
      peers: {
        listen: true,
        onlyconnect: true,
        onlyonion: true,
        addnode: [
          {
            hostname: "test",
            port: 1,
          },
        ],
      },
      dbcache: 5,
      pruning: {
        unionSelectKey: "disabled",
        unionValueKey: {},
      },
      blockfilters: {
        blockfilterindex: false,
        peerblockfilters: false,
      },
      bloomfilters: { peerbloomfilters: false },
    },
  };

  test("Test just the input unions", () => {
    testListUnion.validator().unsafeCast(validInput.testListUnion);
  });
  test("test valid input", () => {
    const output = matchInputSpec.unsafeCast(validInput);
    expect(output).toEqual(validInput);
  });
  test("test no longer care about the conversion of min/max and validating", () => {
    matchInputSpec.unsafeCast(
      deepMerge({}, validInput, { rpc: { advanced: { threads: 0 } } }),
    );
  });
  test("test errors should throw for number in string", () => {
    expect(() =>
      matchInputSpec.unsafeCast(
        deepMerge({}, validInput, { rpc: { enable: 2 } }),
      ),
    ).toThrowError();
  });
  test("Test that we set serialversion to something not segwit or non-segwit", () => {
    expect(() =>
      matchInputSpec.unsafeCast(
        deepMerge({}, validInput, {
          rpc: { advanced: { serialversion: "testing" } },
        }),
      ),
    ).toThrowError();
  });
});
