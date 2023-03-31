import { BuilderExtract, IBuilder } from "./builder";
import { Config } from "./config";
import {
  InputSpec,
  ListValueSpecNumber,
  ListValueSpecString,
  UniqueBy,
  ValueSpecList,
} from "../config-types";
import { guardAll } from "../../util";

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
      type: 'string' as const,
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
    }
  ) {
    const spec = {
      type: "number" as const,
      placeholder: null,
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
      type: "object" as const,
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
      ...value,
    });
  }

  public validator() {
    return guardAll(this.a);
  }
}
