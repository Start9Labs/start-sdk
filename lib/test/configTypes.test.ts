import { ListValueSpecOf, isValueSpecListOf } from "../config/configTypes"
import { Config } from "../config/builder/config"
import { List } from "../config/builder/list"
import { Value } from "../config/builder/value"

describe("Config Types", () => {
  test("isValueSpecListOf", () => {
    const options = [List.obj, List.text, List.number]
    for (const option of options) {
      const test = option({} as any, { spec: Config.of({}) } as any) as any
      const someList = Value.list(test).build()
      if (isValueSpecListOf(someList, "text")) {
        someList.spec satisfies ListValueSpecOf<"text">
      } else if (isValueSpecListOf(someList, "number")) {
        someList.spec satisfies ListValueSpecOf<"number">
      } else if (isValueSpecListOf(someList, "object")) {
        someList.spec satisfies ListValueSpecOf<"object">
      } else {
        throw new Error(
          "Failed to figure out the type: " + JSON.stringify(someList),
        )
      }
    }
  })
})
