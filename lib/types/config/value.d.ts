import { BuilderExtract, IBuilder } from "./builder.js";
import { Config } from "./config.js";
import { List } from "./list.js";
import { Variants } from "./variants.js";
import { ConfigSpec, UniqueBy, ValueSpec, ValueSpecList, ValueSpecNumber, ValueSpecString } from "../types/config-types.js";
export type DefaultString = string | {
    charset: string | null | undefined;
    len: number;
};
export type Description = {
    name: string;
    description: string | null;
    warning: string | null;
};
export type Default<A> = {
    default: A;
};
export type NullableDefault<A> = {
    default: null | A;
};
export type StringSpec = {
    masked: boolean | null;
    placeholder: string | null;
    pattern: null | string;
    "pattern-description": null | string;
    textarea: boolean | null;
};
export type NumberSpec = {
    range: string;
    integral: boolean;
    units: string | null;
    placeholder: string | null;
};
export type Nullable = {
    nullable: boolean;
};
export declare class Value<A extends ValueSpec> extends IBuilder<A> {
    static boolean<A extends Description & Default<boolean>>(a: A): Value<{
        type: "boolean";
    } & A>;
    static string<A extends Description & NullableDefault<DefaultString> & Nullable & StringSpec>(a: A): Value<ValueSpecString>;
    static number<A extends Description & NullableDefault<number> & Nullable & NumberSpec>(a: A): Value<ValueSpecNumber>;
    static enum<A extends Description & Default<string> & {
        values: readonly string[] | string[];
        "value-names": Record<string, string>;
    }>(a: A): Value<{
        type: "enum";
    } & A>;
    static object<A extends {
        name: string;
        description: string | null;
        warning: string | null;
        default: null | {
            [k: string]: unknown;
        };
        "display-as": null | string;
        "unique-by": null | string;
        spec: Config<ConfigSpec>;
        "value-names": Record<string, string>;
    }>(a: A): Value<{
        type: "object";
    } & Omit<A, "spec"> & {
        spec: BuilderExtract<A["spec"]>;
    }>;
    static union<A extends Description & Default<string> & {
        tag: {
            id: B;
            name: string;
            description: string | null;
            warning: string | null;
            "variant-names": {
                [key: string]: string;
            };
        };
        variants: Variants<{
            [key: string]: ConfigSpec;
        }>;
        "display-as": string | null;
        "unique-by": UniqueBy;
    }, B extends string>(a: A): Value<{
        type: "union";
    } & Omit<A, "variants"> & {
        variants: BuilderExtract<A["variants"]>;
    }>;
    static list<A extends List<ValueSpecList>>(a: A): Value<ValueSpecList>;
}
