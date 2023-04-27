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
  ValueSpecSelect,
  ValueSpecText,
  ValueSpecTextarea,
} from "../configTypes";
import { guardAll } from "../../util";
import { DefaultString } from "../configTypes";
import { _ } from "../../util";

type RequiredLike<A> =
  | false
  | true
  | { default: A }
  | { defaultWithRequired: A };

function requiredLikeToAbove<Input extends RequiredLike<any>>(
  requiredLike: Input,
) {
  // prettier-ignore
  return {
    default: 
      (typeof requiredLike === "object" ? (
        'default' in requiredLike ? requiredLike.default : requiredLike.defaultWithRequired
      ) : 
      null) as Input extends { default: infer T } | {defaultWithRequired: infer T} ? T : null,
    required: (requiredLike === true ? true : false) as (
      Input extends true ? true :
      Input extends { defaultWithRequired: unknown } ? true :    
      false
    ),
  };
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
export class Value<A extends ValueSpec> extends IBuilder<A> {
  static toggle(a: {
    name: string;
    description: string | null;
    warning: string | null;
    default: boolean | null;
  }) {
    return new Value({
      type: "toggle" as const,
      ...a,
    });
  }

  static text<Required extends RequiredLike<DefaultString>>(a: {
    name: string;
    description?: string | null;
    warning?: string | null;
    required: Required;
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
    });
  }
  static textarea(a: {
    name: string;
    description: string | null;
    warning: string | null;
    required: boolean;
    minLength: number | null;
    maxLength: number | null;
    placeholder: string | null;
  }) {
    return new Value({
      type: "textarea" as const,
      ...a,
    } as ValueSpecTextarea);
  }
  static number<
    A extends {
      name: string;
      description: string | null;
      warning: string | null;
      required: boolean;
      default: number | null;
      min: number | null;
      max: number | null;
      /** Default = '1' */
      step: string | null;
      integer: boolean;
      units: string | null;
      placeholder: string | null;
    },
  >(a: A) {
    return new Value({
      type: "number" as const,
      ...a,
    });
  }
  static color<
    A extends {
      name: string;
      description: string | null;
      warning: string | null;
      required: boolean;
      default: string | null;
    },
  >(a: A) {
    return new Value({
      type: "color" as const,
      ...a,
    });
  }
  static datetime(a: {
    name: string;
    description: string | null;
    warning: string | null;
    required: boolean;
    /** Default = 'datetime-local' */
    inputmode: ValueSpecDatetime["inputmode"];
    min: string | null;
    max: string | null;
    step: string | null;
    default: string | null;
  }) {
    return new Value({
      type: "datetime" as const,
      ...a,
    });
  }
  static select<
    A extends {
      name: string;
      description: string | null;
      warning: string | null;
      required: boolean;
      default: string | null;
      values: { [key: string]: string };
    },
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
      values: Values;
      minLength: number | null;
      maxLength: number | null;
    },
    Values extends Record<string, string>,
  >(a: A) {
    return new Value({
      type: "multiselect" as const,
      ...a,
    });
  }
  static object<Spec extends Config<InputSpec>>(
    a: {
      name: string;
      description: string | null;
      warning: string | null;
    },
    previousSpec: Spec,
  ) {
    const spec = previousSpec.build() as BuilderExtract<Spec>;
    return new Value({
      type: "object" as const,
      ...a,
      spec,
    });
  }
  static union<
    V extends Variants<{ [key: string]: { name: string; spec: InputSpec } }>,
  >(
    a: {
      name: string;
      description: string | null;
      warning: string | null;
      required: boolean;
      default: string | null;
    },
    aVariants: V,
  ) {
    const variants = aVariants.build() as BuilderExtract<V>;
    return new Value({
      type: "union" as const,
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
