import { IBuilder } from "./builder.js";
export class List extends IBuilder {
    // // deno-lint-ignore ban-types
    // static boolean<A extends Description & Default<boolean[]> & { range: string; spec: {}; default: boolean }>(a: A) {
    //   return new List({
    //     type: "list" as const,
    //     subtype: "boolean" as const,
    //     ...a,
    //   });
    // }
    static string(a) {
        return new List({
            type: "list",
            subtype: "string",
            ...a,
        });
    }
    static number(a) {
        return new List({
            type: "list",
            subtype: "number",
            ...a,
        });
    }
    static enum(a) {
        return new List({
            type: "list",
            subtype: "enum",
            ...a,
        });
    }
    static obj(a) {
        const { spec: previousSpec, ...rest } = a;
        const { spec: previousSpecSpec, ...restSpec } = previousSpec;
        const specSpec = previousSpecSpec.build();
        const spec = {
            ...restSpec,
            spec: specSpec,
        };
        const value = {
            spec,
            ...rest,
        };
        return new List({
            type: "list",
            subtype: "object",
            ...value,
        });
    }
    static union(a) {
        const { spec: previousSpec, ...rest } = a;
        const { variants: previousVariants, ...restSpec } = previousSpec;
        const variants = previousVariants.build();
        const spec = {
            ...restSpec,
            variants,
        };
        const value = {
            spec,
            ...rest,
        };
        return new List({
            type: "list",
            subtype: "union",
            ...value,
        });
    }
}
