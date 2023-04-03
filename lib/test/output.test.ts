import { UnionSelectKey, unionSelectKey } from "../config/config-types";
import { InputSpec, matchInputSpec } from "./output";

export type IfEquals<T, U, Y = unknown, N = never> = (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2
  ? Y
  : N;
export function testOutput<A, B>(): (c: IfEquals<A, B>) => null {
  return () => null;
}

function isObject(item: unknown): item is object {
  return !!(item && typeof item === "object" && !Array.isArray(item));
}
type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R : never;
export function mergeDeep<A extends unknown[]>(...sources: A) {
  return _mergeDeep({}, ...sources);
}
function _mergeDeep<A extends unknown[]>(
  target: UnionToIntersection<A[number]> | {},
  ...sources: A
): UnionToIntersection<A[number]> | {} {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject((source as any)[key])) {
        if (!(target as any)[key]) Object.assign(target, { [key]: {} });
        _mergeDeep((target as any)[key], (source as any)[key]);
      } else {
        Object.assign(target, { [key]: (source as any)[key] });
      }
    }
  }

  return _mergeDeep(target, ...sources);
}

/// Testing the types of the input spec
// @ts-expect-error Because enable should be a boolean
testOutput<InputSpec["rpc"]["enable"], string>()(null);
testOutput<InputSpec["rpc"]["enable"], boolean>()(null);
testOutput<InputSpec["rpc"]["username"], string>()(null);

testOutput<InputSpec["rpc"]["advanced"]["auth"], string[]>()(null);
testOutput<InputSpec["rpc"]["advanced"]["serialversion"], "segwit" | "non-segwit">()(null);
testOutput<InputSpec["rpc"]["advanced"]["servertimeout"], number>()(null);
testOutput<InputSpec["advanced"]["peers"]["addnode"][0]["hostname"], string>()(null);
testOutput<InputSpec["testListUnion"][0][UnionSelectKey]["name"], string>()(null);
testOutput<InputSpec["testListUnion"][0][UnionSelectKey][UnionSelectKey], "lnd">()(null);
// prettier-ignore
// @ts-expect-error Expect that the string is the one above
testOutput<InputSpec["testListUnion"][0][UnionSelectKey][UnionSelectKey], "unionSelectKey">()(null);

/// Here we test the output of the matchInputSpec function
describe("Inputs", () => {
  const validInput: InputSpec = {
    testListUnion: [
      {
        [unionSelectKey]: { [unionSelectKey]: "lnd", name: "string" },
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
        [unionSelectKey]: "disabled",
      },
      blockfilters: {
        blockfilterindex: false,
        peerblockfilters: false,
      },
      bloomfilters: { peerbloomfilters: false },
    },
  };
  test("test valid input", () => {
    const output = matchInputSpec.unsafeCast(validInput);
    expect(output).toEqual(validInput);
  });
  test("test errors", () => {
    expect(() =>
      matchInputSpec.unsafeCast(mergeDeep(validInput, { rpc: { advanced: { threads: 0 } } }))
    ).toThrowError();
    expect(() => matchInputSpec.unsafeCast(mergeDeep(validInput, { rpc: { enable: 2 } }))).toThrowError();

    expect(() =>
      matchInputSpec.unsafeCast(
        mergeDeep(validInput, {
          rpc: { advanced: { serialversion: "testing" } },
        })
      )
    ).toThrowError();
    matchInputSpec.unsafeCast(validInput);
  });
});
