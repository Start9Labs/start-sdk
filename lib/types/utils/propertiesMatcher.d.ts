import { matches } from "../dependencies.js";
import { ConfigSpec, ValueSpec as ValueSpecAny } from "../types/config-types.js";
type TypeBoolean = "boolean";
type TypeString = "string";
type TypeNumber = "number";
type TypeObject = "object";
type TypeList = "list";
type TypeEnum = "enum";
type TypePointer = "pointer";
type TypeUnion = "union";
type GuardDefaultNullable<A, Type> = A extends {
    readonly default: unknown;
} ? Type : A extends {
    readonly nullable: true;
} ? Type : A extends {
    readonly nullable: false;
} ? Type | null | undefined : Type;
type GuardNumber<A> = A extends {
    readonly type: TypeNumber;
} ? GuardDefaultNullable<A, number> : unknown;
type GuardString<A> = A extends {
    readonly type: TypeString;
} ? GuardDefaultNullable<A, string> : unknown;
type GuardBoolean<A> = A extends {
    readonly type: TypeBoolean;
} ? GuardDefaultNullable<A, boolean> : unknown;
type GuardObject<A> = A extends {
    readonly type: TypeObject;
    readonly spec: infer B;
} ? (B extends Record<string, unknown> ? {
    readonly [K in keyof B & string]: _<GuardAll<B[K]>>;
} : {
    _error: "Invalid Spec";
}) : unknown;
type GuardList<A> = A extends {
    readonly type: TypeList;
    readonly subtype: infer B;
    spec?: {
        spec: infer C;
    };
} ? ReadonlyArray<GuardAll<Omit<A, "type" | "spec"> & ({
    type: B;
    spec: C;
})>> : unknown;
type GuardPointer<A> = A extends {
    readonly type: TypePointer;
} ? (string | null) : unknown;
type GuardEnum<A> = A extends {
    readonly type: TypeEnum;
    readonly values: ArrayLike<infer B>;
} ? GuardDefaultNullable<A, B> : unknown;
type GuardUnion<A> = A extends {
    readonly type: TypeUnion;
    readonly tag: {
        id: infer Id & string;
    };
    variants: infer Variants & Record<string, unknown>;
} ? {
    [K in keyof Variants]: {
        [keyType in Id & string]: K;
    } & TypeFromProps<Variants[K]>;
}[keyof Variants] : unknown;
type _<T> = T;
export type GuardAll<A> = GuardNumber<A> & GuardString<A> & GuardBoolean<A> & GuardObject<A> & GuardList<A> & GuardPointer<A> & GuardUnion<A> & GuardEnum<A>;
export type TypeFromProps<A> = A extends Record<string, unknown> ? {
    readonly [K in keyof A & string]: _<GuardAll<A[K]>>;
} : unknown;
/**
 * @param generate.charset Pattern like "a-z" or "a-z,1-5"
 * @param generate.len Length to make random variable
 * @param param1
 * @returns
 */
export declare function generateDefault(generate: {
    charset: string;
    len: number;
}, { random }?: {
    random?: (() => number) | undefined;
}): string;
export declare function matchNumberWithRange(range: string): matches.Validator<unknown, number>;
/**
 * ConfigSpec: Tells the UI how to ask for information, verification, and will send the service a config in a shape via the spec.
 * ValueSpecAny: This is any of the values in a config spec.
 *
 * Use this when we want to convert a value spec any into a parser for what a config will look like
 * @param value
 * @returns
 */
export declare function guardAll<A extends ValueSpecAny>(value: A): matches.Parser<unknown, GuardAll<A>>;
/**
 * ConfigSpec: Tells the UI how to ask for information, verification, and will send the service a config in a shape via the spec.
 * ValueSpecAny: This is any of the values in a config spec.
 *
 * Use this when we want to convert a config spec into a parser for what a config will look like
 * @param valueDictionary
 * @returns
 */
export declare function typeFromProps<A extends ConfigSpec>(valueDictionary: A): matches.Parser<unknown, TypeFromProps<A>>;
export {};
