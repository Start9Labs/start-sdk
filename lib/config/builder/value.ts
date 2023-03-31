import { BuilderExtract, IBuilder } from "./builder";
import { Config } from "./config";
import { List } from "./list";
import { Variants } from "./variants";
import {
  InputSpec,
  ListValueSpecString,
  ValueSpec,
  ValueSpecList,
  ValueSpecNumber,
  ValueSpecTextarea,
} from "../config-types";
import { guardAll } from "../../util";
import { DefaultString } from "../config-types";
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
  static boolean(a: {
    name: string;
    description?: string | null;
    warning?: string | null;
    default?: boolean | null;
  }) {
    return new Value({
      description: null,
      warning: null,
      default: null,
      type: "boolean" as const,
      ...a,
    });
  }
  static string(a: {
    name: string;
    description?: string | null;
    warning?: string | null;
    required: boolean;
    default?: DefaultString | null;
    /** Default = false */
    masked?: boolean;
    placeholder?: string | null;
    pattern?: string | null;
    patternDescription?: string | null;
    /** Default = 'text' */
    inputmode?: ListValueSpecString["inputmode"];
  }) {
    return new Value({
      type: "string" as const,
      default: null,
      description: null,
      warning: null,
      masked: false,
      placeholder: null,
      pattern: null,
      patternDescription: null,
      inputmode: "text",
      ...a,
    });
  }
  static textarea(a: {
    name: string;
    description?: string | null;
    warning?: string | null;
    required: boolean;
    placeholder?: string | null;
  }) {
    return new Value({
      description: null,
      warning: null,
      placeholder: null,
      type: "textarea" as const,
      ...a,
    } as ValueSpecTextarea);
  }
  static number(a: {
    name: string;
    description?: string | null;
    warning?: string | null;
    required: boolean;
    default?: number | null;
    /** default = "(\*,\*)" */
    range?: string;
    integral: boolean;
    units?: string | null;
    placeholder?: string | null;
  }) {
    return new Value({
      type: "number" as const,
      description: null,
      warning: null,
      default: null,
      range: "(*,*)",
      units: null,
      placeholder: null,
      ...a,
    } as ValueSpecNumber);
  }
  static select<B extends Record<string, string>>(a: {
    name: string;
    description?: string | null;
    warning?: string | null;
    required: boolean;
    default?: string | null;
    values: B;
  }) {
    return new Value({
      description: null,
      warning: null,
      default: null,
      type: "select" as const,
      ...a,
    });
  }
  static multiselect<Values extends Record<string, string>>(a: {
    name: string;
    description?: string | null;
    warning?: string | null;
    default?: string[];
    values: Values;
    /** default = "(\*,\*)" */
    range?: string;
  }) {
    return new Value({
      type: "multiselect" as const,
      range: "(*,*)",
      warning: null,
      default: [],
      description: null,
      ...a,
    });
  }
  static object<Spec extends Config<InputSpec>>(a: {
    name: string;
    description?: string | null;
    warning?: string | null;
    default?: null | { [k: string]: unknown };
    spec: Spec;
  }) {
    const { spec: previousSpec, ...rest } = a;
    const spec = previousSpec.build() as BuilderExtract<Spec>;
    return new Value({
      type: "object" as const,
      description: null,
      warning: null,
      default: null,
      ...rest,
      spec,
    });
  }
  static union<
    V extends Variants<{ [key: string]: { name: string; spec: InputSpec } }>
  >(
    a: {
      name: string;
      description?: string | null;
      warning?: string | null;
      required: boolean;
      default?: string | null;
    },
    aVariants: V
  ) {
    const variants = aVariants.build() as BuilderExtract<V>;
    return new Value({
      type: "union" as const,
      description: null,
      warning: null,
      default: null,
      ...a,
      variants,
    });
  }

  static list<A extends ValueSpecList>(a: List<A>) {
    return new Value(a.build());
  }
  public validator() {
    return guardAll(this.a);
  }
}
