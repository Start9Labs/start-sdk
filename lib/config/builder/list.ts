import { BuilderExtract, IBuilder } from "./builder";
import { Config } from "./config";
import {
  InputSpec,
  UniqueBy,
  ValueSpecList,
} from "../config-types";
import { guardAll } from "../../util";

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
  static string<
    A extends {
      name: string;
      description: string | null;
      warning: string | null;
      default: string[];
      range: string;
      spec: {
        masked: boolean;
        placeholder: string | null;
        pattern: string | null;
        patternDescription: string | null;
        textarea: boolean | null;
      };
    }
  >(a: A) {
    return new List({
      type: "list" as const,
      subtype: "string" as const,
      ...a,
    });
  }
  static number<
    A extends {
      name: string;
      description: string | null;
      warning: string | null;
      default: string[];
      range: string;
      spec: {
        range: string;
        integral: boolean;
        units: string | null;
        placeholder: string | null;
      };
    }
  >(a: A) {
    return new List({
      type: "list" as const,
      subtype: "number" as const,
      ...a,
    });
  }
  static obj<
    A extends {
      name: string;
      description: string | null;
      warning: string | null;
      default: Record<string, unknown>[];
      range: string;
      spec: {
        spec: Config<InputSpec>;
        displayAs: null | string;
        uniqueBy: null | UniqueBy;
      };
    }
  >(a: A) {
    const { spec: previousSpec, ...rest } = a;
    const { spec: previousSpecSpec, ...restSpec } = previousSpec;
    const specSpec = previousSpecSpec.build() as BuilderExtract<
      A["spec"]["spec"]
    >;
    const spec = {
      ...restSpec,
      spec: specSpec,
    };
    const value = {
      spec,
      ...rest,
    };
    return new List({
      type: "list" as const,
      subtype: "object" as const,
      ...value,
    });
  }

  public validator() {
    return guardAll(this.a);
  }
}
