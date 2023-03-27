import { InputSpec, matchInputSpec } from "./output";

type TEqual<A, B> = A extends B ? (B extends A ? null : never) : never;
function testOutput<A, B>(): (c: TEqual<A, B>) => null {
  return () => null;
}
const testValue = null as unknown;
// @ts-expect-error Because enable should be a boolean
testOutput<InputSpec["rpc"]["enable"], string>()(null);
testOutput<InputSpec["rpc"]["enable"], boolean>()(null);
testOutput<InputSpec["rpc"]["username"], string>()(null);

testOutput<InputSpec["rpc"]["advanced"]["auth"], readonly string[]>()(null);
testOutput<InputSpec["rpc"]["advanced"]["serialversion"], readonly string[]>()(null);
describe("Inputs", () => {
  test("test", () => {
    expect(true).toEqual(true);
  });
});
