import { Config, LazyBuild } from "./config"
import {
  ListValueSpecText,
  Pattern,
  UniqueBy,
  ValueSpecList,
  ValueSpecListOf,
  ValueSpecText,
} from "../configTypes"
import { Parser, arrayOf, number, string } from "ts-matches"
/**
 * Used as a subtype of Value.list
```ts
export const authorizationList = List.string({
  "name": "Authorization",
  "range": "[0,*)",
  "default": [],
  "description": "Username and hashed password for JSON-RPC connections. RPC clients connect using the usual http basic authentication.",
  "warning": null
}, {"masked":false,"placeholder":null,"pattern":"^[a-zA-Z0-9_-]+:([0-9a-fA-F]{2})+\\$([0-9a-fA-F]{2})+$","patternDescription":"Each item must be of the form \"<USERNAME>:<SALT>$<HASH>\"."});
export const auth = Value.list(authorizationList);
```
*/
export class List<Type, WD> {
  private constructor(
    public build: LazyBuild<WD, ValueSpecList>,
    public validator: Parser<unknown, Type>,
  ) {}
  static text<WD>(
    a: {
      name: string
      description?: string | null
      warning?: string | null
      /** Default = [] */
      default?: string[]
      minLength?: number | null
      maxLength?: number | null
    },
    aSpec: {
      /** Default = false */
      masked?: boolean
      placeholder?: string | null
      minLength?: number | null
      maxLength?: number | null
      patterns: Pattern[]
      /** Default = "text" */
      inputmode?: ListValueSpecText["inputmode"]
    },
  ) {
    return new List<string[], WD>(() => {
      const spec = {
        type: "text" as const,
        placeholder: null,
        minLength: null,
        maxLength: null,
        masked: false,
        inputmode: "text" as const,
        ...aSpec,
      }
      return {
        description: null,
        warning: null,
        default: [],
        type: "list" as const,
        minLength: null,
        maxLength: null,
        disabled: false,
        ...a,
        spec,
      } satisfies ValueSpecListOf<"text">
    }, arrayOf(string))
  }
  static dynamicText<WD>(
    getA: LazyBuild<
      WD,
      {
        name: string
        description?: string | null
        warning?: string | null
        /** Default = [] */
        default?: string[]
        minLength?: number | null
        maxLength?: number | null
        disabled?: false | string
        spec: {
          /** Default = false */
          masked?: boolean
          placeholder?: string | null
          minLength?: number | null
          maxLength?: number | null
          patterns: Pattern[]
          /** Default = "text" */
          inputmode?: ListValueSpecText["inputmode"]
        }
      }
    >,
  ) {
    return new List<string[], WD>(async (options) => {
      const { spec: aSpec, ...a } = await getA(options)
      const spec = {
        type: "text" as const,
        placeholder: null,
        minLength: null,
        maxLength: null,
        masked: false,
        inputmode: "text" as const,
        ...aSpec,
      }
      return {
        description: null,
        warning: null,
        default: [],
        type: "list" as const,
        minLength: null,
        maxLength: null,
        disabled: false,
        ...a,
        spec,
      } satisfies ValueSpecListOf<"text">
    }, arrayOf(string))
  }
  static number<WD>(
    a: {
      name: string
      description?: string | null
      warning?: string | null
      /** Default = [] */
      default?: string[]
      minLength?: number | null
      maxLength?: number | null
    },
    aSpec: {
      integer: boolean
      min?: number | null
      max?: number | null
      step?: string | null
      units?: string | null
      placeholder?: string | null
    },
  ) {
    return new List<number[], WD>(() => {
      const spec = {
        type: "number" as const,
        placeholder: null,
        min: null,
        max: null,
        step: null,
        units: null,
        ...aSpec,
      }
      return {
        description: null,
        warning: null,
        minLength: null,
        maxLength: null,
        default: [],
        type: "list" as const,
        disabled: false,
        ...a,
        spec,
      } satisfies ValueSpecListOf<"number">
    }, arrayOf(number))
  }
  static dynamicNumber<WD>(
    getA: LazyBuild<
      WD,
      {
        name: string
        description?: string | null
        warning?: string | null
        /** Default = [] */
        default?: string[]
        minLength?: number | null
        maxLength?: number | null
        disabled?: false | string
        spec: {
          integer: boolean
          min?: number | null
          max?: number | null
          step?: string | null
          units?: string | null
          placeholder?: string | null
        }
      }
    >,
  ) {
    return new List<number[], WD>(async (options) => {
      const { spec: aSpec, ...a } = await getA(options)
      const spec = {
        type: "number" as const,
        placeholder: null,
        min: null,
        max: null,
        step: null,
        units: null,
        ...aSpec,
      }
      return {
        description: null,
        warning: null,
        minLength: null,
        maxLength: null,
        default: [],
        type: "list" as const,
        disabled: false,
        ...a,
        spec,
      }
    }, arrayOf(number))
  }
  static obj<Type extends Record<string, any>, WrapperData>(
    a: {
      name: string
      description?: string | null
      warning?: string | null
      /** Default [] */
      default?: []
      minLength?: number | null
      maxLength?: number | null
    },
    aSpec: {
      spec: Config<Type, WrapperData>
      displayAs?: null | string
      uniqueBy?: null | UniqueBy
    },
  ) {
    return new List<Type[], WrapperData>(async (options) => {
      const { spec: previousSpecSpec, ...restSpec } = aSpec
      const specSpec = await previousSpecSpec.build(options)
      const spec = {
        type: "object" as const,
        displayAs: null,
        uniqueBy: null,
        ...restSpec,
        spec: specSpec,
      }
      const value = {
        spec,
        default: [],
        ...a,
      }
      return {
        description: null,
        warning: null,
        minLength: null,
        maxLength: null,
        type: "list" as const,
        disabled: false,
        ...value,
      }
    }, arrayOf(aSpec.spec.validator))
  }

  /**
   * Use this during the times that the input needs a more specific type.
   * Used in types that the value/ variant/ list/ config is constructed somewhere else.
  ```ts
  const a = Config.text({
    name: "a",
    required: false,
  })

  return Config.of<WrapperData>()({
    myValue: a.withWrapperData(),
  })
  ```
   */
  withWrapperData<NewWrapperData extends WD>() {
    return this as any as List<Type, NewWrapperData>
  }
}
