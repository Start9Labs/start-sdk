import { testOutput } from "./output.test";
import { Config } from "../config/builder/config";
import { List } from "../config/builder/list";
import { Value } from "../config/builder/value";
import { Variants } from "../config/builder/variants";

describe("builder tests", () => {
  test("text", () => {
    const bitcoinPropertiesBuilt: {
      "peer-tor-address": {
        name: string;
        description: string | null;
        type: "text";
      };
    } = Config.of({
      "peer-tor-address": Value.text({
        name: "Peer tor address",
        default: null,
        description: "The Tor address of the peer interface",
        warning: null,
        required: true,
        masked: true,
        placeholder: null,
        minLength: null,
        maxLength: null,
        patterns: [],
      }),
    }).build();
    expect(JSON.stringify(bitcoinPropertiesBuilt)).toEqual(
      /*json*/ `{
    "peer-tor-address": {
      "type": "text",
      "default": null,
      "description": "The Tor address of the peer interface",
      "warning": null,
      "masked": true,
      "placeholder": null,
      "minLength": null,
      "maxLength": null,
      "patterns": [],
      "inputMode":"text",
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
  test("toggle", () => {
    const value = Value.toggle({
      name: "Testing",
    });
    const validator = value.validator();
    validator.unsafeCast(false);
    testOutput<typeof validator._TYPE, boolean>()(null);
  });
  test("text", () => {
    const value = Value.text({
      name: "Testing",
      required: false,
    });
    const validator = value.validator();
    validator.unsafeCast("test text");
    testOutput<typeof validator._TYPE, string>()(null);
  });
  test("color", () => {
    const value = Value.color({
      name: "Testing",
      required: false,
    });
    const validator = value.validator();
    validator.unsafeCast("#000000");
    testOutput<typeof validator._TYPE, string>()(null);
  });
  test("datetime", () => {
    const value = Value.datetime({
      name: "Testing",
      required: false,
    });
    const validator = value.validator();
    validator.unsafeCast("2021-01-01");
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
      integer: false,
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
      default: [],
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
        a: Value.toggle({
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
          spec: Config.of({ b: Value.toggle({ name: "b" }) }),
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
          integer: false,
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
          spec: Config.of({ test: Value.toggle({ name: "test" }) }),
        },
      ),
    );
    const validator = value.validator();
    validator.unsafeCast([{ test: true }]);
    testOutput<typeof validator._TYPE, { test: boolean }[]>()(null);
  });
  test("text", () => {
    const value = Value.list(
      List.text(
        {
          name: "test",
        },
        {
          patterns: [],
        },
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
        { integer: true },
      ),
    );
    const validator = value.validator();
    validator.unsafeCast([12, 45]);
    testOutput<typeof validator._TYPE, number[]>()(null);
  });
});
