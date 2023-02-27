import { ConfigSpec, ValueSpec } from "../types/config-types.js";
import { BuilderExtract, IBuilder } from "./builder.js";
import { Value } from "./value.js";
export declare class Config<A extends ConfigSpec> extends IBuilder<A> {
    static empty(): Config<{}>;
    static withValue<K extends string, B extends ValueSpec>(key: K, value: Value<B>): Config<{ [key in K]: B; }>;
    static addValue<K extends string, B extends ValueSpec>(key: K, value: Value<B>): Config<{ [key in K]: B; }>;
    static of<B extends {
        [key: string]: Value<ValueSpec>;
    }>(spec: B): Config<{ [K in keyof B]: BuilderExtract<B[K]>; }>;
    withValue<K extends string, B extends ValueSpec>(key: K, value: Value<B>): Config<A & { [key in K]: B; }>;
    addValue<K extends string, B extends ValueSpec>(key: K, value: Value<B>): Config<A & { [key in K]: B; }>;
}
