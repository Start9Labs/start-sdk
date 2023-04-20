import { BuilderExtract, IBuilder } from "./builder";
import { Config } from "./config";
import {
  InputSpec,
  ListValueSpecText,
  Pattern,
  UniqueBy,
  ValueSpecList,
} from "../configTypes";
import { guardAll } from "../../util";
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
export class List<A extends ValueSpecList> extends IBuilder<A> {
  static text(
    a: {
      name: string;
      description?: string | null;
      warning?: string | null;
      /** Default = [] */
      default?: string[];
      /** Default = 0 */
      minLength?: number | null;
      maxLength?: number | null;
    },
    aSpec: {
      /** Default = false */
      masked?: boolean;
      placeholder?: string | null;
      minLength?: number | null;
      maxLength?: number | null;
      patterns: Pattern[];
      /** Default = "text" */
      inputmode?: ListValueSpecText["inputmode"];
    },
  ) {
    const spec = {
      type: "text" as const,
      placeholder: null,
      minLength: null,
      maxLength: null,
      masked: false,
      inputmode: "text" as const,
      ...aSpec,
    };
    return new List({
      description: null,
      warning: null,
      default: [],
      type: "list" as const,
      minLength: 0,
      maxLength: null,
      ...a,
      spec,
    });
  }
  static number(
    a: {
      name: string;
      description?: string | null;
      warning?: string | null;
      /** Default = [] */
      default?: string[];
      /** Default = 0 */
      minLength?: number | null;
      maxLength?: number | null;
    },
    aSpec: {
      integer: boolean;
      min?: number | null;
      max?: number | null;
      step?: string | null;
      units?: string | null;
      placeholder?: string | null;
    },
  ) {
    const spec = {
      type: "number" as const,
      placeholder: null,
      min: null,
      max: null,
      step: null,
      units: null,
      ...aSpec,
    };
    return new List({
      description: null,
      warning: null,
      minLength: 0,
      maxLength: null,
      default: [],
      type: "list" as const,
      ...a,
      spec,
    });
  }
  static obj<Spec extends Config<InputSpec>>(
    a: {
      name: string;
      description?: string | null;
      warning?: string | null;
      /** Default [] */
      default?: [];
      /** Default = 0 */
      minLength?: number | null;
      maxLength?: number | null;
    },
    aSpec: {
      spec: Spec;
      displayAs?: null | string;
      uniqueBy?: null | UniqueBy;
    },
  ) {
    const { spec: previousSpecSpec, ...restSpec } = aSpec;
    const specSpec = previousSpecSpec.build() as BuilderExtract<Spec>;
    const spec = {
      type: "object" as const,
      displayAs: null,
      uniqueBy: null,
      ...restSpec,
      spec: specSpec,
    };
    const value = {
      spec,
      default: [],
      ...a,
    };
    return new List({
      description: null,
      warning: null,
      minLength: 0,
      maxLength: null,
      type: "list" as const,
      ...value,
    });
  }

  public validator() {
    return guardAll(this.a);
  }
}
