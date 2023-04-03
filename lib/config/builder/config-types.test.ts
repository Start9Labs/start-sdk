import { ListValueSpecOf, ValueSpecList, isValueSpecListOf } from "../config-types";
import { Config } from "./config";
import { List } from "./list";
import { Value } from "./value";

describe("Config Types", () => {
  test("isValueSpecListOf", () => {
    const options = [List.obj, List.string, List.number];
    for (const option of options) {
      const test = option({} as any, { spec: Config.of({}) } as any) as any;
      const someList = Value.list(test).build();
      if (isValueSpecListOf(someList, "string")) {
        someList.spec satisfies ListValueSpecOf<"string">;
      } else if (isValueSpecListOf(someList, "number")) {
        someList.spec satisfies ListValueSpecOf<"number">;
      } else if (isValueSpecListOf(someList, "object")) {
        someList.spec satisfies ListValueSpecOf<"object">;
      } else {
        throw new Error("Failed to figure out the type: " + JSON.stringify(someList));
      }
    }
  });
});
