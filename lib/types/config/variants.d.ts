import { ConfigSpec } from "../types/config-types.js";
import { BuilderExtract, IBuilder } from "./builder.js";
import { Config } from "./mod.js";
export declare class Variants<A extends {
    [key: string]: ConfigSpec;
}> extends IBuilder<A> {
    static of<A extends {
        [key: string]: Config<ConfigSpec>;
    }>(a: A): Variants<{ [K in keyof A]: BuilderExtract<A[K]>; }>;
    static empty(): Variants<{}>;
    static withVariant<K extends string, B extends ConfigSpec>(key: K, value: Config<B>): Variants<{} & { [key in K]: B; }>;
    withVariant<K extends string, B extends ConfigSpec>(key: K, value: Config<B>): Variants<A & { [key in K]: B; }>;
}
