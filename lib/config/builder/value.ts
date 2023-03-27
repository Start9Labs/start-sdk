import { BuilderExtract, IBuilder } from "./builder";
import { Config } from "./config";
import { List } from "./list";
import { Variants } from "./variants";
import {
  InputSpec,
  ValueSpec,
  ValueSpecList,
  ValueSpecNumber,
  ValueSpecString,
} from "../config-types";

export type DefaultString =
  | string
  | {
      charset: string | null | undefined;
      len: number;
    };

/**
 * A value is going to be part of the form in the FE of the OS.
 * Something like a boolean, a string, a number, etc.
 * in the fe it will ask for the name of value, and use the rest of the value to determine how to render it.
 * While writing with a value, you will start with `Value.` then let the IDE suggest the rest.
 * for things like string, the options are going to be in {}.
 * Keep an eye out for another config builder types as params.
 * Note, usually this is going to be used in a `Config` {@link Config} builder.
 ```ts
    Value.string({
      name: "Name of This Value",
      description: "Going to be what the description is in the FE, hover over",
      warning: "What the warning is going to be on warning situations",
      default: null,
      nullable: false,
      masked: null, // If there is a masked, then the value is going to be masked in the FE, like a password
      placeholder: null, // If there is a placeholder, then the value is going to be masked in the FE, like a password
      pattern: null, // A regex pattern to validate the value
      patternDescription: null,
      textarea: null
    })
 ```
 */
export class Value<A extends ValueSpec> extends IBuilder<A> {
  static boolean<
    A extends {
      name: string;
      description: string | null;
      warning: string | null;
      default: boolean | null;
    }
  >(a: A) {
    return new Value({
      type: "boolean" as const,
      ...a,
    });
  }
  static string<
    A extends {
      name: string;
      description: string | null;
      warning: string | null;
      nullable: boolean;
      default: DefaultString | null;
      masked: boolean | null;
      placeholder: string | null;
      pattern: string | null;
      patternDescription: string | null;
      textarea: boolean | null;
    }
  >(a: A) {
    return new Value({
      type: "string" as const,
      ...a,
    } as ValueSpecString);
  }
  static number<
    A extends {
      name: string;
      description: string | null;
      warning: string | null;
      nullable: boolean;
      default: number | null;
      range: string;
      integral: boolean;
      units: string | null;
      placeholder: string | null;
    }
  >(a: A) {
    return new Value({
      type: "number" as const,
      ...a,
    } as ValueSpecNumber);
  }
  static select<
    A extends {
      name: string;
      description: string | null;
      warning: string | null;
      nullable: boolean;
      default: string | null;
      values: Record<string, string>;
    }
  >(a: A) {
    return new Value({
      type: "select" as const,
      ...a,
    });
  }
  static multiselect<
    A extends {
      name: string;
      description: string | null;
      warning: string | null;
      default: string[];
      values: Record<string, string>;
      range: string;
    }
  >(a: A) {
    return new Value({
      type: "multiselect" as const,
      ...a,
    });
  }
  static object<
    A extends {
      name: string;
      description: string | null;
      warning: string | null;
      default: null | { [k: string]: unknown };
      spec: Config<InputSpec>;
    }
  >(a: A) {
    const { spec: previousSpec, ...rest } = a;
    const spec = previousSpec.build() as BuilderExtract<A["spec"]>;
    return new Value({
      type: "object" as const,
      ...rest,
      spec,
    });
  }
  static union<
    A extends {
      name: string;
      description: string | null;
      warning: string | null;
      variants: Variants<{ [key: string]: { name: string; spec: InputSpec } }>;
      default: string;
    }
  >(a: A) {
    const { variants: previousVariants, ...rest } = a;
    const variants = previousVariants.build() as BuilderExtract<A["variants"]>;
    return new Value({
      type: "union" as const,
      ...rest,
      variants,
    });
  }

  static list<A extends List<ValueSpecList>>(a: A) {
    return new Value(a.build());
  }
}
