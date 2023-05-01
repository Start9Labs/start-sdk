import { Config, LazyBuild, LazyBuildOptions } from "./config"
import { List } from "./list"
import { Variants } from "./variants"
import {
  Pattern,
  ValueSpec,
  ValueSpecDatetime,
  ValueSpecText,
  ValueSpecTextarea,
} from "../configTypes"
import { once } from "../../util"
import { DefaultString } from "../configTypes"
import { _ } from "../../util"
import {
  Parser,
  anyOf,
  arrayOf,
  boolean,
  literal,
  literals,
  number,
  object,
  string,
  unknown,
} from "ts-matches"

type RequiredDefault<A> =
  | false
  | {
      default: A | null
    }

function requiredLikeToAbove<Input extends RequiredDefault<A>, A>(
  requiredLike: Input,
) {
  // prettier-ignore
  return {
    required: (typeof requiredLike === 'object' ? true : requiredLike) as (
      Input extends { default: unknown} ? true:
      Input extends true ? true :
      false
    ),
    default:(typeof requiredLike === 'object' ? requiredLike.default : null) as (
      Input extends { default: infer Default } ? Default :
      null
    )
  };
}
type AsRequired<Type, MaybeRequiredType> = MaybeRequiredType extends
  | { default: unknown }
  | never
  ? Type
  : Type | null | undefined

type InputAsRequired<A, Type> = A extends
  | { required: { default: any } | never }
  | never
  ? Type
  : Type | null | undefined
const testForAsRequiredParser = once(
  () => object({ required: object({ default: unknown }) }).test,
)
function asRequiredParser<
  Type,
  Input,
  Return extends
    | Parser<unknown, Type>
    | Parser<unknown, Type | null | undefined>,
>(parser: Parser<unknown, Type>, input: Input): Return {
  if (testForAsRequiredParser()(input)) return parser as any
  return parser.optional() as any
}

/**
 * A value is going to be part of the form in the FE of the OS.
 * Something like a boolean, a string, a number, etc.
 * in the fe it will ask for the name of value, and use the rest of the value to determine how to render it.
 * While writing with a value, you will start with `Value.` then let the IDE suggest the rest.
 * for things like string, the options are going to be in {}.
 * Keep an eye out for another config builder types as params.
 * Note, usually this is going to be used in a `Config` {@link Config} builder.
 ```ts
const username = Value.string({
  name: "Username",
  default: "bitcoin",
  description: "The username for connecting to Bitcoin over RPC.",
  warning: null,
  required: true,
  masked: true,
  placeholder: null,
  pattern: "^[a-zA-Z0-9_]+$",
  patternDescription: "Must be alphanumeric (can contain underscore).",
});
 ```
 */
export class Value<Type, WD, ConfigType> {
  private constructor(
    public build: LazyBuild<WD, ConfigType, ValueSpec>,
    public validator: Parser<unknown, Type>,
  ) {}
  static toggle<WD, CT>(a: {
    name: string
    description?: string | null
    warning?: string | null
    default?: boolean | null
  }) {
    return new Value<boolean, WD, CT>(
      async () => ({
        description: null,
        warning: null,
        default: null,
        type: "toggle" as const,
        ...a,
      }),
      boolean,
    )
  }
  static dynamicToggle<WD, CT>(
    a: LazyBuild<
      WD,
      CT,
      {
        name: string
        description?: string | null
        warning?: string | null
        default?: boolean | null
      }
    >,
  ) {
    return new Value<boolean, WD, CT>(
      async (options) => ({
        description: null,
        warning: null,
        default: null,
        type: "toggle" as const,
        ...(await a(options)),
      }),
      boolean,
    )
  }
  static text<Required extends RequiredDefault<DefaultString>, WD, CT>(a: {
    name: string
    description?: string | null
    warning?: string | null
    required: Required

    /** Default = false */
    masked?: boolean
    placeholder?: string | null
    minLength?: number | null
    maxLength?: number | null
    patterns?: Pattern[]
    /** Default = 'text' */
    inputmode?: ValueSpecText["inputmode"]
  }) {
    return new Value<AsRequired<string, Required>, WD, CT>(
      async () => ({
        type: "text" as const,
        description: null,
        warning: null,
        masked: false,
        placeholder: null,
        minLength: null,
        maxLength: null,
        patterns: [],
        inputmode: "text",
        ...a,
        ...requiredLikeToAbove(a.required),
      }),
      asRequiredParser(string, a),
    )
  }
  static dynamicText<WD, CT>(
    getA: LazyBuild<
      WD,
      CT,
      {
        name: string
        description?: string | null
        warning?: string | null
        required: RequiredDefault<DefaultString>

        /** Default = false */
        masked?: boolean
        placeholder?: string | null
        minLength?: number | null
        maxLength?: number | null
        patterns?: Pattern[]
        /** Default = 'text' */
        inputmode?: ValueSpecText["inputmode"]
      }
    >,
  ) {
    return new Value<string | null | undefined, WD, CT>(async (options) => {
      const a = await getA(options)
      return {
        type: "text" as const,
        description: null,
        warning: null,
        masked: false,
        placeholder: null,
        minLength: null,
        maxLength: null,
        patterns: [],
        inputmode: "text",
        ...a,
        ...requiredLikeToAbove(a.required),
      }
    }, string.optional())
  }
  static textarea<WD, CT>(a: {
    name: string
    description?: string | null
    warning?: string | null
    required: boolean
    minLength?: number | null
    maxLength?: number | null
    placeholder?: string | null
  }) {
    return new Value<string, WD, CT>(
      async () =>
        ({
          description: null,
          warning: null,
          minLength: null,
          maxLength: null,
          placeholder: null,
          type: "textarea" as const,
          ...a,
        } satisfies ValueSpecTextarea),
      string,
    )
  }
  static dynamicTextarea<WD, CT>(
    getA: LazyBuild<
      WD,
      CT,
      {
        name: string
        description?: string | null
        warning?: string | null
        required: boolean
        minLength?: number | null
        maxLength?: number | null
        placeholder?: string | null
      }
    >,
  ) {
    return new Value<string, WD, CT>(async (options) => {
      const a = await getA(options)
      return {
        description: null,
        warning: null,
        minLength: null,
        maxLength: null,
        placeholder: null,
        type: "textarea" as const,
        ...a,
      }
    }, string)
  }
  static number<Required extends RequiredDefault<number>, WD, CT>(a: {
    name: string
    description?: string | null
    warning?: string | null
    required: Required
    min?: number | null
    max?: number | null
    /** Default = '1' */
    step?: string | null
    integer: boolean
    units?: string | null
    placeholder?: string | null
  }) {
    return new Value<AsRequired<number, Required>, WD, CT>(
      () => ({
        type: "number" as const,
        description: null,
        warning: null,
        min: null,
        max: null,
        step: null,
        units: null,
        placeholder: null,
        ...a,
        ...requiredLikeToAbove(a.required),
      }),
      asRequiredParser(number, a),
    )
  }
  static dynamicNumber<WD, CT>(
    getA: LazyBuild<
      WD,
      CT,
      {
        name: string
        description?: string | null
        warning?: string | null
        required: RequiredDefault<number>
        min?: number | null
        max?: number | null
        /** Default = '1' */
        step?: string | null
        integer: boolean
        units?: string | null
        placeholder?: string | null
      }
    >,
  ) {
    return new Value<number | null | undefined, WD, CT>(async (options) => {
      const a = await getA(options)
      return {
        type: "number" as const,
        description: null,
        warning: null,
        min: null,
        max: null,
        step: null,
        units: null,
        placeholder: null,
        ...a,
        ...requiredLikeToAbove(a.required),
      }
    }, number.optional())
  }
  static color<Required extends RequiredDefault<string>, WD, CT>(a: {
    name: string
    description?: string | null
    warning?: string | null
    required: Required
  }) {
    return new Value<AsRequired<string, Required>, WD, CT>(
      () => ({
        type: "color" as const,
        description: null,
        warning: null,
        ...a,
        ...requiredLikeToAbove(a.required),
      }),

      asRequiredParser(string, a),
    )
  }

  static dynamicColor<WD, CT>(
    getA: LazyBuild<
      WD,
      CT,
      {
        name: string
        description?: string | null
        warning?: string | null
        required: RequiredDefault<string>
      }
    >,
  ) {
    return new Value<string | null | undefined, WD, CT>(async (options) => {
      const a = await getA(options)
      return {
        type: "color" as const,
        description: null,
        warning: null,
        ...a,
        ...requiredLikeToAbove(a.required),
      }
    }, string.optional())
  }
  static datetime<Required extends RequiredDefault<string>, WD, CT>(a: {
    name: string
    description?: string | null
    warning?: string | null
    required: Required
    /** Default = 'datetime-local' */
    inputmode?: ValueSpecDatetime["inputmode"]
    min?: string | null
    max?: string | null
    step?: string | null
  }) {
    return new Value<AsRequired<string, Required>, WD, CT>(
      () => ({
        type: "datetime" as const,
        description: null,
        warning: null,
        inputmode: "datetime-local",
        min: null,
        max: null,
        step: null,
        ...a,
        ...requiredLikeToAbove(a.required),
      }),
      asRequiredParser(string, a),
    )
  }
  static dynamicDatetime<WD, CT>(
    getA: LazyBuild<
      WD,
      CT,
      {
        name: string
        description?: string | null
        warning?: string | null
        required: RequiredDefault<string>
        /** Default = 'datetime-local' */
        inputmode?: ValueSpecDatetime["inputmode"]
        min?: string | null
        max?: string | null
        step?: string | null
      }
    >,
  ) {
    return new Value<string | null | undefined, WD, CT>(async (options) => {
      const a = await getA(options)
      return {
        type: "datetime" as const,
        description: null,
        warning: null,
        inputmode: "datetime-local",
        min: null,
        max: null,
        step: null,
        ...a,
        ...requiredLikeToAbove(a.required),
      }
    }, string.optional())
  }
  static select<
    Required extends RequiredDefault<string>,
    B extends Record<string, string>,
    WD,
    CT,
  >(a: {
    name: string
    description?: string | null
    warning?: string | null
    required: Required
    values: B
  }) {
    return new Value<AsRequired<keyof B, Required>, WD, CT>(
      () => ({
        description: null,
        warning: null,
        type: "select" as const,
        ...a,
        ...requiredLikeToAbove(a.required),
      }),
      asRequiredParser(
        anyOf(
          ...Object.keys(a.values).map((x: keyof B & string) => literal(x)),
        ),
        a,
      ) as any,
    )
  }
  static dynamicSelect<WD, CT>(
    getA: LazyBuild<
      WD,
      CT,
      {
        name: string
        description?: string | null
        warning?: string | null
        required: RequiredDefault<string>
        values: Record<string, string>
      }
    >,
  ) {
    return new Value<string | null | undefined, WD, CT>(async (options) => {
      const a = await getA(options)
      return {
        description: null,
        warning: null,
        type: "select" as const,
        ...a,
        ...requiredLikeToAbove(a.required),
      }
    }, string.optional())
  }
  static multiselect<Values extends Record<string, string>, WD, CT>(a: {
    name: string
    description?: string | null
    warning?: string | null
    default: string[]
    values: Values
    minLength?: number | null
    maxLength?: number | null
  }) {
    return new Value<(keyof Values)[], WD, CT>(
      () => ({
        type: "multiselect" as const,
        minLength: null,
        maxLength: null,
        warning: null,
        description: null,
        ...a,
      }),
      arrayOf(
        literals(...(Object.keys(a.values) as any as [keyof Values & string])),
      ),
    )
  }
  static dynamicMultiselect<WD, CT>(
    getA: LazyBuild<
      WD,
      CT,
      {
        name: string
        description?: string | null
        warning?: string | null
        default: string[]
        values: Record<string, string>
        minLength?: number | null
        maxLength?: number | null
      }
    >,
  ) {
    return new Value<string[], WD, CT>(async (options) => {
      const a = await getA(options)
      return {
        type: "multiselect" as const,
        minLength: null,
        maxLength: null,
        warning: null,
        description: null,
        ...a,
      }
    }, arrayOf(string))
  }
  static object<Type extends Record<string, any>, WrapperData, ConfigType>(
    a: {
      name: string
      description?: string | null
      warning?: string | null
    },
    previousSpec: Config<Type, WrapperData, ConfigType>,
  ) {
    return new Value<Type, WrapperData, ConfigType>(async (options) => {
      const spec = await previousSpec.build(options as any)
      return {
        type: "object" as const,
        description: null,
        warning: null,
        ...a,
        spec,
      }
    }, previousSpec.validator)
  }
  static union<
    Required extends RequiredDefault<string>,
    Type,
    WrapperData,
    ConfigType,
  >(
    a: {
      name: string
      description?: string | null
      warning?: string | null
      required: Required
      default?: string | null
    },
    aVariants: Variants<Type, WrapperData, ConfigType>,
  ) {
    return new Value<AsRequired<Type, Required>, WrapperData, ConfigType>(
      async (options) => ({
        type: "union" as const,
        description: null,
        warning: null,
        ...a,
        variants: await aVariants.build(options as any),
        ...requiredLikeToAbove(a.required),
      }),
      asRequiredParser(aVariants.validator, a),
    )
  }
  static filteredUnion<
    Required extends RequiredDefault<string>,
    Type,
    WrapperData,
    ConfigType,
  >(
    a: {
      name: string
      description?: string | null
      warning?: string | null
      required: Required
      default?: string | null
    },
    aVariants: Variants<Type, WrapperData, ConfigType>,
    getDisabledFn: LazyBuild<
      WrapperData,
      ConfigType,
      Array<Type extends { unionSelectKey: infer B } ? B & string : never>
    >,
  ) {
    return new Value<Type | null | undefined, WrapperData, ConfigType>(
      async (options) => ({
        type: "union" as const,
        description: null,
        warning: null,
        ...a,
        variants: await aVariants.build(options as any),
        ...requiredLikeToAbove(a.required),
        disabled: (await getDisabledFn(options)) || [],
      }),
      aVariants.validator.optional(),
    )
  }

  static list<Type, WrapperData, ConfigType>(
    a: List<Type, WrapperData, ConfigType>,
  ) {
    /// TODO
    return new Value<Type, WrapperData, ConfigType>(
      (options) => a.build(options),
      a.validator,
    )
  }
}
