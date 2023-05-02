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
export class Value<Type, WD> {
  private constructor(
    public build: LazyBuild<WD, ValueSpec>,
    public validator: Parser<unknown, Type>,
  ) {}
  static toggle<WD>(a: {
    name: string
    description?: string | null
    warning?: string | null
    default?: boolean | null
    /**  Immutable means it can only be configed at the first config then never again 
    Default is false */
    immutable?: boolean
  }) {
    return new Value<boolean, WD>(
      async () => ({
        description: null,
        warning: null,
        default: null,
        type: "toggle" as const,
        disabled: false,
        immutable: a.immutable ?? false,
        ...a,
      }),
      boolean,
    )
  }
  static dynamicToggle<WD>(
    a: LazyBuild<
      WD,
      {
        name: string
        description?: string | null
        warning?: string | null
        default?: boolean | null
        disabled?: false | string
      }
    >,
  ) {
    return new Value<boolean, WD>(
      async (options) => ({
        description: null,
        warning: null,
        default: null,
        type: "toggle" as const,
        disabled: false,
        immutable: false,
        ...(await a(options)),
      }),
      boolean,
    )
  }
  static text<Required extends RequiredDefault<DefaultString>, WD>(a: {
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
    /**  Immutable means it can only be configed at the first config then never again 
    Default is false */
    immutable?: boolean
  }) {
    return new Value<AsRequired<string, Required>, WD>(
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
        disabled: false,
        immutable: a.immutable ?? false,
        ...a,
        ...requiredLikeToAbove(a.required),
      }),
      asRequiredParser(string, a),
    )
  }
  static dynamicText<WD>(
    getA: LazyBuild<
      WD,
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
    return new Value<string | null | undefined, WD>(async (options) => {
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
        disabled: false,
        immutable: false,
        ...a,
        ...requiredLikeToAbove(a.required),
      }
    }, string.optional())
  }
  static textarea<WD>(a: {
    name: string
    description?: string | null
    warning?: string | null
    required: boolean
    minLength?: number | null
    maxLength?: number | null
    placeholder?: string | null
    /**  Immutable means it can only be configed at the first config then never again 
    Default is false */
    immutable?: boolean
  }) {
    return new Value<string, WD>(
      async () =>
        ({
          description: null,
          warning: null,
          minLength: null,
          maxLength: null,
          placeholder: null,
          type: "textarea" as const,
          disabled: false,
          immutable: a.immutable ?? false,
          ...a,
        } satisfies ValueSpecTextarea),
      string,
    )
  }
  static dynamicTextarea<WD>(
    getA: LazyBuild<
      WD,
      {
        name: string
        description?: string | null
        warning?: string | null
        required: boolean
        minLength?: number | null
        maxLength?: number | null
        placeholder?: string | null
        disabled?: false | string
      }
    >,
  ) {
    return new Value<string, WD>(async (options) => {
      const a = await getA(options)
      return {
        description: null,
        warning: null,
        minLength: null,
        maxLength: null,
        placeholder: null,
        type: "textarea" as const,
        disabled: false,
        immutable: false,
        ...a,
      }
    }, string)
  }
  static number<Required extends RequiredDefault<number>, WD>(a: {
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
    /**  Immutable means it can only be configed at the first config then never again 
    Default is false */
    immutable?: boolean
  }) {
    return new Value<AsRequired<number, Required>, WD>(
      () => ({
        type: "number" as const,
        description: null,
        warning: null,
        min: null,
        max: null,
        step: null,
        units: null,
        placeholder: null,
        disabled: false,
        immutable: a.immutable ?? false,
        ...a,
        ...requiredLikeToAbove(a.required),
      }),
      asRequiredParser(number, a),
    )
  }
  static dynamicNumber<WD>(
    getA: LazyBuild<
      WD,
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
        disabled?: false | string
      }
    >,
  ) {
    return new Value<number | null | undefined, WD>(async (options) => {
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
        disabled: false,
        immutable: false,
        ...a,
        ...requiredLikeToAbove(a.required),
      }
    }, number.optional())
  }
  static color<Required extends RequiredDefault<string>, WD>(a: {
    name: string
    description?: string | null
    warning?: string | null
    required: Required
    /**  Immutable means it can only be configed at the first config then never again 
    Default is false */
    immutable?: boolean
  }) {
    return new Value<AsRequired<string, Required>, WD>(
      () => ({
        type: "color" as const,
        description: null,
        warning: null,
        disabled: false,
        immutable: a.immutable ?? false,
        ...a,
        ...requiredLikeToAbove(a.required),
      }),

      asRequiredParser(string, a),
    )
  }

  static dynamicColor<WD>(
    getA: LazyBuild<
      WD,
      {
        name: string
        description?: string | null
        warning?: string | null
        required: RequiredDefault<string>

        disabled?: false | string
      }
    >,
  ) {
    return new Value<string | null | undefined, WD>(async (options) => {
      const a = await getA(options)
      return {
        type: "color" as const,
        description: null,
        warning: null,
        disabled: false,
        immutable: false,
        ...a,
        ...requiredLikeToAbove(a.required),
      }
    }, string.optional())
  }
  static datetime<Required extends RequiredDefault<string>, WD>(a: {
    name: string
    description?: string | null
    warning?: string | null
    required: Required
    /** Default = 'datetime-local' */
    inputmode?: ValueSpecDatetime["inputmode"]
    min?: string | null
    max?: string | null
    step?: string | null
    /**  Immutable means it can only be configed at the first config then never again 
    Default is false */
    immutable?: boolean
  }) {
    return new Value<AsRequired<string, Required>, WD>(
      () => ({
        type: "datetime" as const,
        description: null,
        warning: null,
        inputmode: "datetime-local",
        min: null,
        max: null,
        step: null,
        disabled: false,
        immutable: a.immutable ?? false,
        ...a,
        ...requiredLikeToAbove(a.required),
      }),
      asRequiredParser(string, a),
    )
  }
  static dynamicDatetime<WD>(
    getA: LazyBuild<
      WD,
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
        disabled?: false | string
      }
    >,
  ) {
    return new Value<string | null | undefined, WD>(async (options) => {
      const a = await getA(options)
      return {
        type: "datetime" as const,
        description: null,
        warning: null,
        inputmode: "datetime-local",
        min: null,
        max: null,
        step: null,
        disabled: false,
        immutable: false,
        ...a,
        ...requiredLikeToAbove(a.required),
      }
    }, string.optional())
  }
  static select<
    Required extends RequiredDefault<string>,
    B extends Record<string, string>,
    WD,
  >(a: {
    name: string
    description?: string | null
    warning?: string | null
    required: Required
    values: B
    /**  Immutable means it can only be configed at the first config then never again 
    Default is false */
    immutable?: boolean
  }) {
    return new Value<AsRequired<keyof B, Required>, WD>(
      () => ({
        description: null,
        warning: null,
        type: "select" as const,
        disabled: false,
        immutable: a.immutable ?? false,
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
  static dynamicSelect<WD>(
    getA: LazyBuild<
      WD,
      {
        name: string
        description?: string | null
        warning?: string | null
        required: RequiredDefault<string>
        values: Record<string, string>
        disabled?: false | string
      }
    >,
  ) {
    return new Value<string | null | undefined, WD>(async (options) => {
      const a = await getA(options)
      return {
        description: null,
        warning: null,
        type: "select" as const,
        disabled: false,
        immutable: false,
        ...a,
        ...requiredLikeToAbove(a.required),
      }
    }, string.optional())
  }
  static multiselect<Values extends Record<string, string>, WD>(a: {
    name: string
    description?: string | null
    warning?: string | null
    default: string[]
    values: Values
    minLength?: number | null
    maxLength?: number | null
    /**  Immutable means it can only be configed at the first config then never again 
    Default is false */
    immutable?: boolean
  }) {
    return new Value<(keyof Values)[], WD>(
      () => ({
        type: "multiselect" as const,
        minLength: null,
        maxLength: null,
        warning: null,
        description: null,
        disabled: false,
        immutable: a.immutable ?? false,
        ...a,
      }),
      arrayOf(
        literals(...(Object.keys(a.values) as any as [keyof Values & string])),
      ),
    )
  }
  static dynamicMultiselect<WD>(
    getA: LazyBuild<
      WD,
      {
        name: string
        description?: string | null
        warning?: string | null
        default: string[]
        values: Record<string, string>
        minLength?: number | null
        maxLength?: number | null
        disabled?: false | string
      }
    >,
  ) {
    return new Value<string[], WD>(async (options) => {
      const a = await getA(options)
      return {
        type: "multiselect" as const,
        minLength: null,
        maxLength: null,
        warning: null,
        description: null,
        disabled: false,
        immutable: false,
        ...a,
      }
    }, arrayOf(string))
  }
  static object<Type extends Record<string, any>, WrapperData>(
    a: {
      name: string
      description?: string | null
      warning?: string | null
    },
    previousSpec: Config<Type, WrapperData>,
  ) {
    return new Value<Type, WrapperData>(async (options) => {
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
      /**  Immutable means it can only be configed at the first config then never again 
      Default is false */
      immutable?: boolean
    },
    aVariants: Variants<Type, WrapperData>,
  ) {
    return new Value<AsRequired<Type, Required>, WrapperData>(
      async (options) => ({
        type: "union" as const,
        description: null,
        warning: null,
        ...a,
        variants: await aVariants.build(options as any),
        ...requiredLikeToAbove(a.required),
        immutable: a.immutable ?? false,
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
    aVariants: Variants<Type, WrapperData>,
    getDisabledFn: LazyBuild<
      WrapperData,
      Array<Type extends { unionSelectKey: infer B } ? B & string : never>
    >,
  ) {
    return new Value<Type | null | undefined, WrapperData>(
      async (options) => ({
        type: "union" as const,
        description: null,
        warning: null,
        ...a,
        variants: await aVariants.build(options as any),
        ...requiredLikeToAbove(a.required),
        disabled: (await getDisabledFn(options)) || [],
        immutable: false,
      }),
      aVariants.validator.optional(),
    )
  }

  static list<Type, WrapperData>(a: List<Type, WrapperData>) {
    /// TODO
    return new Value<Type, WrapperData>(
      (options) => a.build(options),
      a.validator,
    )
  }

  withWrapperData<NewWrapperData extends WD>() {
    return this as any as Value<Type, NewWrapperData>
  }
}
