import { IBuilder } from "./builder.js";
export class Value extends IBuilder {
    static boolean(a) {
        return new Value({
            type: "boolean",
            ...a,
        });
    }
    static string(a) {
        return new Value({
            type: "string",
            ...a,
        });
    }
    static number(a) {
        return new Value({
            type: "number",
            ...a,
        });
    }
    static enum(a) {
        return new Value({
            type: "enum",
            ...a,
        });
    }
    static object(a) {
        const { spec: previousSpec, ...rest } = a;
        const spec = previousSpec.build();
        return new Value({
            type: "object",
            ...rest,
            spec,
        });
    }
    static union(a) {
        const { variants: previousVariants, ...rest } = a;
        const variants = previousVariants.build();
        return new Value({
            type: "union",
            ...rest,
            variants,
        });
    }
    static list(a) {
        return new Value(a.build());
    }
}
