import { Config, LazyBuild } from "./config"
import {
  ListValueSpecText,
  Pattern,
  UniqueBy,
  ValueSpecList,
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
export class List<Type, WD, ConfigType> {
  private constructor(
    public build: LazyBuild<WD, ConfigType, ValueSpecList>,
    public validator: Parser<unknown, Type>,
  ) {}
  static text<WD, CT>(
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
    return new List<string[], WD, CT>(() => {
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
        ...a,
        spec,
      }
    }, arrayOf(string))
  }
  static dynamicText<WD, CT>(
    getA: LazyBuild<
      WD,
      CT,
      {
        name: string
        description?: string | null
        warning?: string | null
        /** Default = [] */
        default?: string[]
        minLength?: number | null
        maxLength?: number | null
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
    return new List<string[], WD, CT>(async (options) => {
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
        ...a,
        spec,
      }
    }, arrayOf(string))
  }
  static number<WD, CT>(
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
    return new List<number[], WD, CT>(() => {
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
        ...a,
        spec,
      }
    }, arrayOf(number))
  }
  static dynamicNumber<WD, CT>(
    getA: LazyBuild<
      WD,
      CT,
      {
        name: string
        description?: string | null
        warning?: string | null
        /** Default = [] */
        default?: string[]
        minLength?: number | null
        maxLength?: number | null
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
    return new List<number[], WD, CT>(async (options) => {
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
        ...a,
        spec,
      }
    }, arrayOf(number))
  }
  static obj<Type extends Record<string, any>, WrapperData, ConfigType>(
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
      spec: Config<Type, WrapperData, ConfigType>
      displayAs?: null | string
      uniqueBy?: null | UniqueBy
    },
  ) {
    return new List<Type[], WrapperData, ConfigType>(async (options) => {
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
        ...value,
      }
    }, arrayOf(aSpec.spec.validator))
  }
}
