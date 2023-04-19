import { testOutput } from "./output.test";
import { Config } from "../config/builder/config";
import { List } from "../config/builder/list";
import { Value } from "../config/builder/value";
import { Variants } from "../config/builder/variants";
import { Parser } from "ts-matches";

describe("builder tests", () => {
  test("String", () => {
    const bitcoinPropertiesBuilt: {
      "peer-tor-address": {
        name: string;
        description: string | null;
        type: "string";
      };
    } = Config.of({
      "peer-tor-address": Value.string({
        name: "Peer tor address",
        default: "",
        description: "The Tor address of the peer interface",
        warning: null,
        required: true,
        masked: true,
        placeholder: null,
        pattern: null,
        patternDescription: null,
      }),
    }).build();
    expect(JSON.stringify(bitcoinPropertiesBuilt)).toEqual(
      /*json*/ `{
    "peer-tor-address": {
      "type": "string",
      "default": "",
      "description": "The Tor address of the peer interface",
      "warning": null,
      "masked": true,
      "placeholder": null,
      "pattern": null,
      "patternDescription": null,
      "inputmode":"text",
      "name": "Peer tor address",
      "required": true
    }}`
        .replaceAll("\n", " ")
        .replaceAll(/\s{2,}/g, "")
        .replaceAll(": ", ":"),
    );
  });
});

describe("values", () => {
  test("boolean", () => {
    const value = Value.boolean({
      name: "Testing",
    });
    const validator = value.validator();
    validator.unsafeCast(false);
    testOutput<typeof validator._TYPE, boolean>()(null);
  });
  test("string", () => {
    const value = Value.string({
      name: "Testing",
      required: false,
    });
    const validator = value.validator();
    validator.unsafeCast("test text");
    testOutput<typeof validator._TYPE, string>()(null);
  });
  test("textarea", () => {
    const value = Value.textarea({
      name: "Testing",
      required: false,
    });
    const validator = value.validator();
    validator.unsafeCast("test text");
    testOutput<typeof validator._TYPE, string>()(null);
  });
  test("number", () => {
    const value = Value.number({
      name: "Testing",
      required: false,
      integral: false,
    });
    const validator = value.validator();
    validator.unsafeCast(2);
    testOutput<typeof validator._TYPE, number>()(null);
  });
  test("select", () => {
    const value = Value.select({
      name: "Testing",
      required: false,
      values: {
        a: "A",
        b: "B",
      },
    });
    const validator = value.validator();
    validator.unsafeCast("a");
    validator.unsafeCast("b");
    testOutput<typeof validator._TYPE, "a" | "b">()(null);
  });
  test("multiselect", () => {
    const value = Value.multiselect({
      name: "Testing",
      values: {
        a: "A",
        b: "B",
      },
    });
    const validator = value.validator();
    validator.unsafeCast([]);
    validator.unsafeCast(["a", "b"]);
    testOutput<typeof validator._TYPE, Array<"a" | "b">>()(null);
  });
  test("object", () => {
    const value = Value.object(
      {
        name: "Testing",
      },
      Config.of({
        a: Value.boolean({
          name: "test",
        }),
      }),
    );
    const validator = value.validator();
    validator.unsafeCast({ a: true });
    testOutput<typeof validator._TYPE, { a: boolean }>()(null);
  });
  test("union", () => {
    const value = Value.union(
      {
        name: "Testing",
        required: true,
      },
      Variants.of({
        a: {
          name: "a",
          spec: Config.of({ b: Value.boolean({ name: "b" }) }),
        },
      }),
    );
    const validator = value.validator();
    validator.unsafeCast({ unionSelectKey: "a", unionValueKey: { b: false } });
    type Test = typeof validator._TYPE;
    testOutput<
      Test,
      { unionSelectKey: "a" } & { unionValueKey: { b: boolean } }
    >()(null);
  });
  test("list", () => {
    const value = Value.list(
      List.number(
        {
          name: "test",
        },
        {
          integral: false,
        },
      ),
    );
    const validator = value.validator();
    validator.unsafeCast([1, 2, 3]);
    testOutput<typeof validator._TYPE, number[]>()(null);
  });
});

describe("Builder List", () => {
  test("obj", () => {
    const value = Value.list(
      List.obj(
        {
          name: "test",
        },
        {
          spec: Config.of({ test: Value.boolean({ name: "test" }) }),
        },
      ),
    );
    const validator = value.validator();
    validator.unsafeCast([{ test: true }]);
    testOutput<typeof validator._TYPE, { test: boolean }[]>()(null);
  });
  test("string", () => {
    const value = Value.list(
      List.string(
        {
          name: "test",
        },
        {},
      ),
    );
    const validator = value.validator();
    validator.unsafeCast(["test", "text"]);
    testOutput<typeof validator._TYPE, string[]>()(null);
  });
  test("number", () => {
    const value = Value.list(
      List.number(
        {
          name: "test",
        },
        { integral: true },
      ),
    );
    const validator = value.validator();
    validator.unsafeCast([12, 45]);
    testOutput<typeof validator._TYPE, number[]>()(null);
  });
});
