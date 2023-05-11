import { MultiHost } from "../interfaces/Host"
import { NetworkInterfaceBuilder } from "../interfaces/NetworkInterfaceBuilder"
import { Effects } from "../types"
import { createUtils } from "../util"
import { sdk } from "./output.sdk"

describe("host", () => {
  test("Testing that the types work", () => {
    async function test(effects: Effects) {
      const utils = createUtils<never, never>(effects)
      const foo = utils.host.multi({ id: "foo" })
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
  })
})
