import { BuilderExtract, IBuilder } from "./builder";
import { Config } from "./config";
import { List } from "./list";
import { Variants } from "./variants";
import {
  InputSpec,
  Pattern,
  ValueSpec,
  ValueSpecColor,
  ValueSpecDatetime,
  ValueSpecList,
  ValueSpecNumber,
  ValueSpecText,
  ValueSpecTextarea,
} from "../configTypes";
import { guardAll } from "../../util";
import { DefaultString } from "../configTypes";
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
export class Value<A extends ValueSpec> extends IBuilder<A> {
  static toggle(a: {
    name: string;
    description?: string | null;
    warning?: string | null;
    default?: boolean | null;
  }) {
    return new Value({
      description: null,
      warning: null,
      default: null,
      type: "toggle" as const,
      ...a,
    });
  }
  static text(a: {
    name: string;
    description?: string | null;
    warning?: string | null;
    required: boolean;
    default?: DefaultString | null;
    /** Default = false */
    masked?: boolean;
    placeholder?: string | null;
    minLength?: number | null;
    maxLength?: number | null;
    patterns?: Pattern[];
    /** Default = 'text' */
    inputmode?: ValueSpecText["inputmode"];
  }) {
    return new Value({
      type: "text" as const,
      default: null,
      description: null,
      warning: null,
      masked: false,
      placeholder: null,
      minLength: null,
      maxLength: null,
      patterns: [],
      inputmode: "text",
      ...a,
    });
  }
  static textarea(a: {
    name: string;
    description?: string | null;
    warning?: string | null;
    required: boolean;
    minLength?: number | null;
    maxLength?: number | null;
    placeholder?: string | null;
  }) {
    return new Value({
      description: null,
      warning: null,
      minLength: null,
      maxLength: null,
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
    min?: number | null;
    max?: number | null;
    /** Default = '1' */
    step?: string | null;
    integer: boolean;
    units?: string | null;
    placeholder?: string | null;
  }) {
    return new Value({
      type: "number" as const,
      description: null,
      warning: null,
      default: null,
      min: null,
      max: null,
      step: null,
      units: null,
      placeholder: null,
      ...a,
    } as ValueSpecNumber);
  }
  static color(a: {
    name: string;
    description?: string | null;
    warning?: string | null;
    required: boolean;
    default?: number | null;
  }) {
    return new Value({
      type: "color" as const,
      description: null,
      warning: null,
      default: null,
      ...a,
    } as ValueSpecColor);
  }
  static datetime(a: {
    name: string;
    description?: string | null;
    warning?: string | null;
    required: boolean;
    /** Default = 'datetime-local' */
    inputMode?: ValueSpecDatetime['inputMode']
    min?: string | null
    max?: string | null
    step?: string | null
    default?: number | null;
  }) {
    return new Value({
      type: "datetime" as const,
      description: null,
      warning: null,
      inputMode: 'datetime-local',
      min: null,
      max: null,
      step: null,
      default: null,
      ...a,
    } as ValueSpecDatetime);
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
    default: string[];
    values: Values;
    minLength?: number | null;
    maxLength?: number | null;
  }) {
    return new Value({
      type: "multiselect" as const,
      minLength: null,
      maxLength: null,
      warning: null,
      description: null,
      ...a,
    });
  }
  static object<Spec extends Config<InputSpec>>(
    a: {
      name: string;
      description?: string | null;
      warning?: string | null;
    },
    previousSpec: Spec,
  ) {
    const spec = previousSpec.build() as BuilderExtract<Spec>;
    return new Value({
      type: "object" as const,
      description: null,
      warning: null,
      ...a,
      spec,
    });
  }
  static union<
    V extends Variants<{ [key: string]: { name: string; spec: InputSpec } }>,
  >(
    a: {
      name: string;
      description?: string | null;
      warning?: string | null;
      required: boolean;
      default?: string | null;
    },
    aVariants: V,
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
