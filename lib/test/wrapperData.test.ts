import { Effects } from "../types"
import { createMainUtils, utils } from "../util"
import { createWrapperDataContract } from "../wrapperData/wrapperDataContract"

type WrapperType = {
  config: {
    someValue: "a" | "b"
  }
}
const wrapperDataContract = createWrapperDataContract<WrapperType>()
const todo = <A>(): A => {
  throw new Error("not implemented")
}
const noop = () => {}
describe("wrapperData", () => {
  test("types", async () => {
    ;async () => {
      utils(wrapperDataContract, todo<Effects>()).setOwnWrapperData("/config", {
        someValue: "a",
      })
      utils(wrapperDataContract, todo<Effects>()).setOwnWrapperData(
        "/config/someValue",
        "b",
      )
      utils(wrapperDataContract, todo<Effects>()).setOwnWrapperData("", {
        config: { someValue: "b" },
      })
      utils(wrapperDataContract, todo<Effects>()).setOwnWrapperData(
        "/config/someValue",

        // @ts-expect-error Type is wrong for the setting value
        5,
      )
      utils(wrapperDataContract, todo<Effects>()).setOwnWrapperData(
        // @ts-expect-error Path is wrong
        "/config/someVae3lue",
        "someValue",
      )

      todo<Effects>().setWrapperData<WrapperType, "/config/someValue">({
        path: "/config/someValue",
        value: "b",
      })
      todo<Effects>().setWrapperData<WrapperType, "/config/some2Value">({
        //@ts-expect-error Path is wrong
        path: "/config/someValue",
        //@ts-expect-error Path is wrong
        value: "someValueIn",
      })
      todo<Effects>().setWrapperData<WrapperType, "/config/someValue">({
        //@ts-expect-error Path is wrong
        path: "/config/some2Value",
        value: "a",
      })
      ;(await createMainUtils(wrapperDataContract, todo<Effects>())
        .getOwnWrapperData("/config/someValue")
        .const()) satisfies string
      ;(await createMainUtils(wrapperDataContract, todo<Effects>())
        .getOwnWrapperData("/config")
        .const()) satisfies WrapperType["config"]
      await createMainUtils(wrapperDataContract, todo<Effects>())
        // @ts-expect-error Path is wrong
        .getOwnWrapperData("/config/somdsfeValue")
        .const()
      ///  ----------------- ERRORS -----------------

      utils(wrapperDataContract, todo<Effects>()).setOwnWrapperData("", {
        // @ts-expect-error Type is wrong for the setting value
        config: { someValue: "notInAOrB" },
      })
      utils(wrapperDataContract, todo<Effects>()).setOwnWrapperData(
        "/config/someValue",
        // @ts-expect-error Type is wrong for the setting value
        "notInAOrB",
      )
      ;(await utils(wrapperDataContract, todo<Effects>())
        .getOwnWrapperData("/config/someValue")
        // @ts-expect-error Const should normally not be callable
        .const()) satisfies string
      ;(await utils(wrapperDataContract, todo<Effects>())
        .getOwnWrapperData("/config")
        // @ts-expect-error Const should normally not be callable
        .const()) satisfies WrapperType["config"]
      await utils(wrapperDataContract, todo<Effects>())
        // @ts-expect-error Path is wrong
        .getOwnWrapperData("/config/somdsfeValue")
        // @ts-expect-error Const should normally not be callable
        .const()

      ///
      ;(await utils(wrapperDataContract, todo<Effects>())
        .getOwnWrapperData("/config/someValue")
        // @ts-expect-error satisfies type is wrong
        .const()) satisfies number
      ;(await createMainUtils(wrapperDataContract, todo<Effects>())
        // @ts-expect-error Path is wrong
        .getOwnWrapperData("/config/")
        .const()) satisfies WrapperType["config"]
      ;(await todo<Effects>().getWrapperData<WrapperType, "/config/someValue">({
        path: "/config/someValue",
        callback: noop,
      })) satisfies string
      await todo<Effects>().getWrapperData<WrapperType, "/config/someValue">({
        // @ts-expect-error Path is wrong as in it doesn't match above
        path: "/config/someV2alue",
        callback: noop,
      })
      await todo<Effects>().getWrapperData<WrapperType, "/config/someV2alue">({
        // @ts-expect-error Path is wrong as in it doesn't exists in wrapper type
        path: "/config/someV2alue",
        callback: noop,
      })
    }
  })
})
