import { BuilderExtract, IBuilder } from "./builder";
import { Config } from "./config";
import { InputSpec, ListValueSpecNumber, ListValueSpecString, UniqueBy, ValueSpecList } from "../config-types";
import { guardAll } from "../../util";
import { range } from "lodash";

/**
 * Used as a subtype of Value.list
```ts

  export const authorizationList = List.string({
    "name": "Authorization",
    "range": "[0,*)",
    "spec": {
      "masked": null,
      "placeholder": null,
      "pattern": "^[a-zA-Z0-9_-]+:([0-9a-fA-F]{2})+\\$([0-9a-fA-F]{2})+$",
      "patternDescription":
        'Each item must be of the form "<USERNAME>:<SALT>$<HASH>".',
      "textarea": false,
    },
    "default": [],
    "description":
      "Username and hashed password for JSON-RPC connections. RPC clients connect using the usual http basic authentication.",
    "warning": null,
  });
```
 */
export class List<A extends ValueSpecList> extends IBuilder<A> {
  static string(
    a: {
      name: string;
      description?: string | null;
      warning?: string | null;
      /** Default = [] */
      default?: string[];
      /** Default = "(\*,\*)" */
      range?: string;
    },
    aSpec: {
      /** Default = false */
      masked?: boolean;
      placeholder?: string | null;
      pattern?: string | null;
      patternDescription?: string | null;
      /** Default = "text" */
      inputmode?: ListValueSpecString["inputmode"];
    }
  ) {
    const spec = {
      placeholder: null,
      pattern: null,
      patternDescription: null,
      masked: false,
      inputmode: "text" as const,
      ...aSpec,
    };
    return new List({
      description: null,
      warning: null,
      default: [],
      type: "list" as const,
      subtype: "string" as const,
      range: "(*,*)",
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
      /** Default = "(\*,\*)" */
      range?: string;
    },
    aSpec: {
      integral: boolean;
      /** Default = "(\*,\*)" */
      range?: string;
      units?: string | null;
      placeholder?: string | null;
      /** Default = "decimal" */
      inputmode?: ListValueSpecNumber["inputmode"];
    }
  ) {
    const spec = {
      placeholder: null,
      inputmode: "decimal" as const,
      range: "(*,*)",
      units: null,
      ...aSpec,
    };
    return new List({
      description: null,
      warning: null,
      units: null,
      range: "(*,*)",
      default: [],
      type: "list" as const,
      subtype: "number" as const,
      ...a,
      spec,
    });
  }
  static obj<Spec extends Config<InputSpec>>(
    a: {
      name: string;
      description?: string | null;
      warning?: string | null;
      default: Record<string, unknown>[];
      /** Default = "(\*,\*)" */
      range?: string;
    },
    aSpec: {
      spec: Spec;
      displayAs?: null | string;
      uniqueBy?: null | UniqueBy;
    }
  ) {
    const { spec: previousSpecSpec, ...restSpec } = aSpec;
    const specSpec = previousSpecSpec.build() as BuilderExtract<Spec>;
    const spec = {
      displayAs: null,
      uniqueBy: null,
      ...restSpec,
      spec: specSpec,
    };
    const value = {
      spec,
      ...a,
    };
    return new List({
      description: null,
      warning: null,
      range: "(*,*)",
      type: "list" as const,
      subtype: "object" as const,
      ...value,
    });
  }

  public validator() {
    return guardAll(this.a);
  }
}
