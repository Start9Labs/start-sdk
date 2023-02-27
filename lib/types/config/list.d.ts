import { BuilderExtract, IBuilder } from "./builder.js";
import { Config } from "./config.js";
import { Default, NumberSpec, StringSpec } from "./value.js";
import { Description } from "./value.js";
import { Variants } from "./variants.js";
import { ConfigSpec, UniqueBy, ValueSpecList, ValueSpecListOf } from "../types/config-types.js";
export declare class List<A extends ValueSpecList> extends IBuilder<A> {
    static string<A extends Description & Default<string[]> & {
        range: string;
        spec: StringSpec;
    }>(a: A): List<ValueSpecListOf<"string">>;
    static number<A extends Description & Default<number[]> & {
        range: string;
        spec: NumberSpec;
    }>(a: A): List<{
        type: "list";
        subtype: "number";
    } & A>;
    static enum<A extends Description & Default<string[]> & {
        range: string;
        spec: {
            values: string[];
            "value-names": {
                [key: string]: string;
            };
        };
    }>(a: A): List<{
        type: "list";
        subtype: "enum";
    } & A>;
    static obj<A extends Description & Default<Record<string, unknown>[]> & {
        range: string;
        spec: {
            spec: Config<ConfigSpec>;
            "display-as": null | string;
            "unique-by": null | UniqueBy;
        };
    }>(a: A): List<{
        type: "list";
        subtype: "object";
    } & {
        spec: {
            spec: BuilderExtract<A["spec"]["spec"]>;
            "display-as": null | string;
            "unique-by": null | UniqueBy;
        };
    } & Omit<A, "spec">>;
    static union<A extends Description & Default<string[]> & {
        range: string;
        spec: {
            tag: {
                id: B;
                name: string;
                description: null | string;
                warning: null | string;
                "variant-names": {
                    [key: string]: string;
                };
            };
            variants: Variants<{
                [key: string]: ConfigSpec;
            }>;
            "display-as": null | string;
            "unique-by": UniqueBy;
            default: string;
        };
    }, B extends string>(a: A): List<{
        type: "list";
        subtype: "union";
    } & {
        spec: {
            variants: BuilderExtract<A["spec"]["variants"]>;
            tag: {
                id: B;
                name: string;
                description: null | string;
                warning: null | string;
                "variant-names": {
                    [key: string]: string;
                };
            };
            "display-as": null | string;
            "unique-by": UniqueBy;
            default: string;
        };
    } & Omit<A, "spec">>;
}
