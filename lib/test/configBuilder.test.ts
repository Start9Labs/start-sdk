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
        description: "The Tor address of the peer interface",
        warning: null,
        required: true,
        masked: true,
        placeholder: null,
        minLength: null,
        maxLength: null,
        patterns: [],
        inputmode: "text",
      }),
    }).build();
    expect(JSON.stringify(bitcoinPropertiesBuilt)).toEqual(
      /*json*/ `{
    "peer-tor-address": {
      "type": "text",
      "description": "The Tor address of the peer interface",
      "warning": null,
      "masked": true,
      "placeholder": null,
      "minLength": null,
      "maxLength": null,
      "patterns": [],
      "inputmode":"text",
      "name": "Peer tor address",
      "required": true,
      "default": null
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
      description: null,
      warning: null,
      default: null,
    });
    const validator = value.validator();
    validator.unsafeCast(false);
    testOutput<typeof validator._TYPE, boolean>()(null);
  });
  test("text", () => {
    const value = Value.text({
      name: "Testing",
      required: false,
      description: null,
      warning: null,
      masked: false,
      placeholder: null,
      minLength: null,
      maxLength: null,
      patterns: [],
      inputmode: "text",
    });
    const validator = value.validator();
    validator.unsafeCast("test text");
    testOutput<typeof validator._TYPE, string | null | undefined>()(null);
  });
  test("text", () => {
    const value = Value.text({
      name: "Testing",
      required: true,
      description: null,
      warning: null,
      masked: false,
      placeholder: null,
      minLength: null,
      maxLength: null,
      patterns: [],
      inputmode: "text",
    });
    const validator = value.validator();
    validator.unsafeCast("test text");
    testOutput<typeof validator._TYPE, string>()(null);
  });
  test("color", () => {
    const value = Value.color({
      name: "Testing",
      required: false,
      description: null,
      warning: null,
      default: null,
    });
    const validator = value.validator();
    validator.unsafeCast("#000000");
    testOutput<typeof validator._TYPE, string | null | undefined>()(null);
  });
  test("datetime", () => {
    const value = Value.datetime({
      name: "Testing",
      required: false,
      description: null,
      warning: null,
      inputmode: "date",
      min: null,
      max: null,
      step: null,
      default: null,
    });
    const validator = value.validator();
    validator.unsafeCast("2021-01-01");
    testOutput<typeof validator._TYPE, string>()(null);
  });
  test("textarea", () => {
    const value = Value.textarea({
      name: "Testing",
      required: false,
      description: null,
      warning: null,
      minLength: null,
      maxLength: null,
      placeholder: null,
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
      description: null,
      warning: null,
      default: null,
      min: null,
      max: null,
      step: null,
      units: null,
      placeholder: null,
    });
    const validator = value.validator();
    validator.unsafeCast(2);
    testOutput<typeof validator._TYPE, number | null | undefined>()(null);
  });
  test("select", () => {
    const value = Value.select({
      name: "Testing",
      required: true,
      values: {
        a: "A",
        b: "B",
      },
      description: null,
      warning: null,
      default: null,
    });
    const validator = value.validator();
    validator.unsafeCast("a");
    validator.unsafeCast("b");
    expect(() => validator.unsafeCast(null)).toThrowError();
    testOutput<typeof validator._TYPE, "a" | "b">()(null);
  });
  test("nullable select", () => {
    const value = Value.select({
      name: "Testing",
      required: false,
      values: {
        a: "A",
        b: "B",
      },
      description: null,
      warning: null,
      default: null,
    });
    const validator = value.validator();
    validator.unsafeCast("a");
    validator.unsafeCast("b");
    validator.unsafeCast(null);
    testOutput<typeof validator._TYPE, "a" | "b" | null | undefined>()(null);
  });
  test("multiselect", () => {
    const value = Value.multiselect({
      name: "Testing",
      values: {
        a: "A",
        b: "B",
      },
      default: [],
      description: null,
      warning: null,
      minLength: null,
      maxLength: null,
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
        description: null,
        warning: null,
      },
      Config.of({
        a: Value.toggle({
          name: "test",
          description: null,
          warning: null,
          default: null,
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
        description: null,
        warning: null,
        default: null,
      },
      Variants.of({
        a: {
          name: "a",
          spec: Config.of({
            b: Value.toggle({
              name: "b",
              description: null,
              warning: null,
              default: null,
            }),
          }),
        },
      }),
    );
    const validator = value.validator();
    validator.unsafeCast({ unionSelectKey: "a", unionValueKey: { b: false } });
    type Test = typeof validator._TYPE;
    testOutput<Test, { unionSelectKey: "a"; unionValueKey: { b: boolean } }>()(
      null,
    );
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
          spec: Config.of({
            test: Value.toggle({
              name: "test",
              description: null,
              warning: null,
              default: null,
            }),
          }),
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

describe("Nested nullable values", () => {
  test("Testing text", () => {
    const value = Config.of({
      a: Value.text({
        name: "Temp Name",
        description:
          "If no name is provided, the name from config will be used",
        required: false,
        warning: null,
        masked: false,
        placeholder: null,
        minLength: null,
        maxLength: null,
        patterns: [],
        inputmode: "text",
      }),
    });
    const validator = value.validator();
    validator.unsafeCast({ a: null });
    validator.unsafeCast({ a: "test" });
    expect(() => validator.unsafeCast({ a: 4 })).toThrowError();
    testOutput<typeof validator._TYPE, { a: string | null | undefined }>()(
      null,
    );
  });
  test("Testing number", () => {
    const value = Config.of({
      a: Value.number({
        name: "Temp Name",
        description:
          "If no name is provided, the name from config will be used",
        required: false,
        warning: null,
        placeholder: null,
        integer: false,
        default: null,
        min: null,
        max: null,
        step: null,
        units: null,
      }),
    });
    const validator = value.validator();
    validator.unsafeCast({ a: null });
    validator.unsafeCast({ a: 5 });
    expect(() => validator.unsafeCast({ a: "4" })).toThrowError();
    testOutput<typeof validator._TYPE, { a: number | null | undefined }>()(
      null,
    );
  });
  test("Testing color", () => {
    const value = Config.of({
      a: Value.color({
        name: "Temp Name",
        description:
          "If no name is provided, the name from config will be used",
        required: false,
        warning: null,
        default: null,
      }),
    });
    const validator = value.validator();
    validator.unsafeCast({ a: null });
    validator.unsafeCast({ a: "5" });
    expect(() => validator.unsafeCast({ a: 4 })).toThrowError();
    testOutput<typeof validator._TYPE, { a: string | null | undefined }>()(
      null,
    );
  });
  test("Testing select", () => {
    const value = Config.of({
      a: Value.select({
        name: "Temp Name",
        description:
          "If no name is provided, the name from config will be used",
        required: false,
        warning: null,
        default: null,
        values: {
          a: "A",
        },
      }),
    });
    const higher = Value.select({
      name: "Temp Name",
      description: "If no name is provided, the name from config will be used",
      required: false,
      warning: null,
      default: null,
      values: {
        a: "A",
      },
    }).build();

    const validator = value.validator();
    validator.unsafeCast({ a: null });
    validator.unsafeCast({ a: "a" });
    expect(() => validator.unsafeCast({ a: "4" })).toThrowError();
    testOutput<typeof validator._TYPE, { a: "a" | null | undefined }>()(null);
  });
  test("Testing multiselect", () => {
    const value = Config.of({
      a: Value.multiselect({
        name: "Temp Name",
        description:
          "If no name is provided, the name from config will be used",

        warning: null,
        default: [],
        values: {
          a: "A",
        },
        minLength: null,
        maxLength: null,
      }),
    });
    const validator = value.validator();
    validator.unsafeCast({ a: [] });
    validator.unsafeCast({ a: ["a"] });
    expect(() => validator.unsafeCast({ a: "4" })).toThrowError();
    testOutput<typeof validator._TYPE, { a: "a"[] }>()(null);
  });
});
