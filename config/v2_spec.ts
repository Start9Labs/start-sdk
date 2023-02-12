// deno-lint-ignore-file ban-types
import { DefaultString } from "../types.ts";
import { matches } from "../dependencies.ts";

type Validator<A> = matches.Validator<unknown, A>;
const { shape, boolean, string, dictionary, anyOf, arrayOf, every, deferred, number, recursive, unknown } = matches;

export const [matchConfig, setMatchConfig] = deferred<Config>();
export type Config = {
  [key: string]: AnyValue;
};

export const matchDescription = shape(
  {
    name: string,
    description: string,
    warning: string,
  },
  ["description", "warning"]
);

export const matchUniqueBy = recursive<_UniqueBy>((x) => anyOf(string, shape({ any: x }))).optional();
type _UniqueBy = { any: _UniqueBy } | string;
type UniqueBy = null | undefined | _UniqueBy;

export const matchBoolValue: Validator<BoolValue> = shape({
  boolean: every(
    matchDescription,
    shape({
      default: boolean,
    })
  ),
});
export type BoolValue = {
  boolean: {
    name: string;
    description?: string;
    warning?: string;
    default: boolean;
  };
};

export const matchDefaultString = anyOf(
  string,
  shape(
    {
      charset: string,
      len: number,
    },
    ["charset"]
  )
);

export const matchStringValue: Validator<StringValue> = shape({
  string: every(
    shape(
      {
        name: string,
        nullable: boolean,
        // optionals
        description: string,
        warning: string,
        default: matchDefaultString,
        copyable: boolean,
        masked: boolean,
        placeholder: string,
      },
      ["description", "warning", "default", "copyable", "masked", "placeholder"]
    ),
    anyOf(
      shape({}),
      shape({
        pattern: string,
        "pattern-description": string,
      })
    )
  ),
});
export type StringValue = {
  string: {
    name: string;
    description?: string;
    warning?: string;
    default?: DefaultString;
    nullable: boolean;
    copyable?: boolean;
    masked?: boolean;
    placeholder?: string;
  } & (
    | {}
    | {
        pattern: string;
        "pattern-description": string;
      }
  );
};

export const matchNumberValue: Validator<NumberValue> = shape({
  number: every(
    matchDescription,
    shape(
      {
        default: number,
      },
      ["default"]
    )
  ),
});
export type NumberValue = {
  number: {
    name: string;
    default?: number;
    description?: string;
    warning?: string;
  };
};

export const matchEnumValue: Validator<EnumValue> = shape({
  enum: shape(
    {
      name: string,
      default: string,
      values: arrayOf(string),
      "value-names": dictionary([string, string]),
      // optionals
      description: string,
      warning: string,
    },
    ["description", "warning"]
  ),
});
export type EnumValue = {
  enum: {
    name: string;
    default: string;
    values: string[] | readonly string[];
    "value-names": {
      [key: string]: string;
    };
    // optionals
    description?: string;
    warning?: string;
  };
};

const matchListBooleanValue: Validator<ListValue["list"] & { boolean: unknown }> = shape({
  boolean: shape(
    {
      name: string,
      default: arrayOf(boolean),
      spec: shape({}),
      range: string,

      //optionals
      description: string,
      warning: string,
    },
    ["warning", "description"]
  ),
});
const matchListStringValue: Validator<ListValue["list"] & { string: unknown }> = shape({
  string: shape(
    {
      name: string,
      default: arrayOf(string),
      spec: every(
        shape(
          {
            copyable: boolean,
            masked: boolean,
            placeholder: string,
          },
          ["copyable", "masked", "placeholder"]
        ),
        anyOf(
          shape({}),
          shape({
            pattern: string,
            "pattern-description": string,
          })
        )
      ),
      range: string,

      //optionals
      description: string,
      warning: string,
    },
    ["warning", "description"]
  ),
});
const matchListNumberValue: Validator<ListValue["list"] & { number: unknown }> = shape({
  number: shape(
    {
      name: string,
      default: arrayOf(number),
      spec: shape(
        {
          range: string,
          integral: boolean,
          units: string,
          placeholder: number,
        },
        ["range", "integral", "units", "placeholder"]
      ),
      range: string,

      //optionals
      description: string,
      warning: string,
    },
    ["warning", "description"]
  ),
});
const matchListEnumValue: Validator<ListValue["list"] & { enum: unknown }> = shape({
  enum: shape(
    {
      name: string,
      default: arrayOf(string),
      spec: shape({
        values: arrayOf(string),
        "value-names": dictionary([string, string]),
      }),
      range: string,

      //optionals
      description: string,
      warning: string,
    },
    ["warning", "description"]
  ),
});
const matchListObjectValue: Validator<ListValue["list"] & { object: unknown }> = shape({
  object: shape(
    {
      name: string,
      spec: shape(
        {
          spec: matchConfig,
          "display-as": string,
          "unique-by": matchUniqueBy,
        },
        ["display-as", "unique-by"]
      ),
      range: string,

      //optionals
      default: arrayOf(dictionary([string, unknown])),
      description: string,
      warning: string,
    },
    ["default", "warning", "description"]
  ),
});
const matchListUnionValue: Validator<ListValue["list"] & { union: unknown }> = shape({
  union: shape(
    {
      name: string,
      default: arrayOf(string),
      spec: shape(
        {
          /** What tag for the specification, for tag unions */
          tag: shape(
            {
              id: string,
              name: string,
              description: string,
              "variant-names": dictionary([string, string]),
            },
            ["name", "description"]
          ),
          /** The possible enum values */
          variants: dictionary([string, matchConfig]),
          "display-as": string,
          "unique-by": matchUniqueBy,
        },
        ["display-as", "unique-by"]
      ),
      range: string,

      //optionals
      description: string,
      warning: string,
    },
    ["warning", "description"]
  ),
});
export const matchListValue: Validator<ListValue> = shape({
  list: anyOf(
    matchListBooleanValue,
    matchListStringValue,
    matchListNumberValue,
    matchListEnumValue,
    matchListObjectValue,
    matchListUnionValue
  ),
});
export type ListValue = {
  list:
    | {
        boolean: {
          name: string;
          default: boolean[] | readonly boolean[];
          spec: {};
          range: string;

          //optionals
          description?: string;
          warning?: string;
        };
      }
    | {
        string: {
          name: string;
          default: string[] | readonly string[];
          spec:
            | {
                copyable?: boolean | undefined;
                masked?: boolean | undefined;
                placeholder?: string | undefined;
              }
            | ({
                pattern: string;
                "pattern-description": string;
              } & {});
          range: string;

          //optionals
          description?: string;
          warning?: string;
        };
      }
    | {
        number: {
          name: string;
          default: number[] | readonly number[];
          spec: {
            range?: string | undefined;
            integral?: boolean | undefined;
            units?: string | undefined;
            placeholder?: number | undefined;
          };
          range: string;

          //optionals
          description?: string;
          warning?: string;
        };
      }
    | {
        enum: {
          name: string;
          default: string[] | readonly string[];
          spec: {
            values: string[] | readonly string[];
            "value-names": {
              [key: string]: string;
            };
          };
          range: string;

          //optionals
          description?: string;
          warning?: string;
        };
      }
    | {
        object: {
          name: string;
          spec: {
            spec: Config;
            "display-as"?: string | undefined;
            "unique-by"?: UniqueBy | undefined;
          };
          range: string;

          //optionals
          default?: Record<string, unknown>[] | readonly Record<string, unknown>[];
          description?: string;
          warning?: string;
        };
      }
    | {
        union: {
          name: string;
          default: string[] | readonly string[];
          spec: {
            tag: {
              id: string;
              name?: string | undefined;
              description?: string | undefined;
              "variant-names": {
                [key: string]: string;
              };
            };
            variants: {
              [key: string]: Config;
            };
            "display-as"?: string | undefined;
            "unique-by"?: UniqueBy | undefined;
          };
          range: string;

          //optionals
          description?: string;
          warning?: string;
        };
      };
};

export const matchObjectValue: Validator<ObjectValue> = shape({
  object: shape(
    {
      name: string,
      default: matchConfig,
      values: arrayOf(string),
      "value-names": dictionary([string, string]),
      // optionals
      description: string,
      warning: string,
    },
    ["description", "warning"]
  ),
});
export type ObjectValue = {
  object: {
    name: string;
    default: Config;
    values: string[] | readonly string[];
    "value-names": {
      [key: string]: string;
    };
    // optionals
    description?: string;
    warning?: string;
  };
};

export const matchUnionValue: Validator<UnionValue> = shape({
  union: shape(
    {
      name: string,
      default: string,
      tag: shape(
        {
          id: string,
          "variant-names": dictionary([string, string]),
          // optionals
          name: string,
          description: string,
        },
        ["name", "description"]
      ),
      variants: dictionary([string, matchConfig]),

      //optionals
      description: string,
      warning: string,
      "display-as": string,
      "unique-by": matchUniqueBy,
    },
    ["description", "warning", "display-as", "unique-by"]
  ),
});
export type UnionValue = {
  union: {
    name: string;
    default: string;
    tag: {
      id: string;
      name?: string | undefined;
      description?: string | undefined;
      "variant-names": {
        [key: string]: string;
      };
    };
    variants: {
      [key: string]: Config;
    };

    //optionals
    description?: string;
    warning?: string;
    "display-as"?: string | undefined;
    "unique-by"?: UniqueBy | undefined;
  };
};

export const matchPointerValue: Validator<PointerValue> = shape({
  pointer: every(
    shape(
      {
        name: string,

        //optionals
        description: string,
        warning: string,
      },
      ["description", "warning"]
    ),
    anyOf(
      shape({
        package: anyOf(
          shape({ "tor-key": shape({ "package-id": string, inferface: string }) }),
          shape({ "tor-address": shape({ "package-id": string, inferface: string }) }),
          shape({ "lan-address": shape({ "package-id": string, inferface: string }) }),
          shape({ config: shape({ "package-id": string, selector: string, multi: boolean }, ["multi"]) })
        ),
      }),
      shape({
        system: dictionary([string, unknown]),
      })
    )
  ),
});
export type PointerValue = {
  pointer: {
    name: string;

    //optionals
    description?: string;
    warning?: string;
  } & (
    | {
        package:
          | { "tor-key": { "package-id": string; inferface: string } }
          | { "tor-address": { "package-id": string; inferface: string } }
          | { "lan-address": { "package-id": string; inferface: string } }
          | { config: { "package-id": string; selector: string; multi?: boolean } };
      }
    | { system: Record<string, unknown> }
  );
};

export const matchAnyValue = anyOf(
  matchBoolValue,
  matchStringValue,
  matchNumberValue,
  matchEnumValue,
  matchListValue,
  matchObjectValue,
  matchUnionValue,
  matchPointerValue
);
export type AnyValue = typeof matchAnyValue._TYPE;

export const matchSpec = dictionary([string, matchAnyValue]);
export type Spec = typeof matchSpec._TYPE;

export type V2to1Spec<A extends Spec> = {
  [key in keyof A]: V2to1AnyValue<A[key]>;
};
// prettier-ignore
// deno-fmt-ignore
export type V2to1AnyValue<A extends AnyValue> = 
    A extends BoolValue ? (
        {
            tag: "boolean",
        } & A["boolean"]
    ) :
    A extends StringValue ? (
        {
            tag: "string",
        } & A["string"]
    ) :
    A extends NumberValue ? (
        {
            tag: "number",
        } & A["number"]
    ) :
    A extends EnumValue ? (
        {
            tag: "enum",
            subtype: keyof A["enum"]
        } & A["enum"][keyof A["enum"]]
    ) :
    A extends ListValue ? (
        {
            tag: "list",
        } & A["list"]
    ) :
    A extends ObjectValue ? (
        {
            tag: "object",
        } & A["object"]
    ) :
    A extends PointerValue ? (
      {
        name: string, description?: string, warning?: string,}
        & (
          A["pointer"] extends {'package': {'tor-key': infer Target }} ? (
            {tag: "pointer",
            subtype: 'package', target: 'tor-key' } & Target
          ) :
          A["pointer"] extends {'package': {'tor-address': infer Target }} ? (
            {tag: "pointer",
            subtype: 'package', target: 'tor-address' } & Target
          ) :
          A["pointer"] extends {'package': {'lan-address': infer Target }} ? (
            {tag: "pointer",
            subtype: 'package', target: 'lan-address' } & Target
          ) :
          A["pointer"] extends {'package': {'config': infer Target }} ? (
            {tag: "pointer",
            subtype: 'package', target: 'config' } & Target
          ) :
          A["pointer"] extends {'system': infer System } ? (
            {tag: "pointer",
            subtype: 'system'} & System
          ) :
          never
        )
    ) :
    never

setMatchConfig(dictionary([string, matchAnyValue]));
