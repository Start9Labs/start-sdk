export type ConfigSpec = Record<string, ValueSpec>;
export type ValueType = "string" | "number" | "boolean" | "enum" | "list" | "object" | "union";
export type ValueSpec = ValueSpecOf<ValueType>;
export type ValueSpecOf<T extends ValueType> = T extends "string" ? ValueSpecString : T extends "number" ? ValueSpecNumber : T extends "boolean" ? ValueSpecBoolean : T extends "enum" ? ValueSpecEnum : T extends "list" ? ValueSpecList : T extends "object" ? ValueSpecObject : T extends "union" ? ValueSpecUnion : never;
export interface ValueSpecString extends ListValueSpecString, WithStandalone {
    type: "string";
    default: null | DefaultString;
    nullable: boolean;
    textarea: null | boolean;
}
export interface ValueSpecNumber extends ListValueSpecNumber, WithStandalone {
    type: "number";
    nullable: boolean;
    default: null | number;
}
export interface ValueSpecEnum extends ListValueSpecEnum, WithStandalone {
    type: "enum";
    default: string;
}
export interface ValueSpecBoolean extends WithStandalone {
    type: "boolean";
    default: boolean;
}
export interface ValueSpecUnion {
    type: "union";
    tag: UnionTagSpec;
    variants: {
        [key: string]: ConfigSpec;
    };
    default: string;
}
export interface ValueSpecObject extends WithStandalone {
    type: "object";
    spec: ConfigSpec;
}
export interface WithStandalone {
    name: string;
    description: null | string;
    warning: null | string;
}
export type ListValueSpecType = "string" | "number" | "enum" | "object" | "union";
export type ListValueSpecOf<T extends ListValueSpecType> = T extends "string" ? ListValueSpecString : T extends "number" ? ListValueSpecNumber : T extends "enum" ? ListValueSpecEnum : T extends "object" ? ListValueSpecObject : T extends "union" ? ListValueSpecUnion : never;
export type ValueSpecList = ValueSpecListOf<ListValueSpecType>;
export interface ValueSpecListOf<T extends ListValueSpecType> extends WithStandalone {
    type: "list";
    subtype: T;
    spec: ListValueSpecOf<T>;
    range: string;
    default: string[] | number[] | DefaultString[] | object[] | readonly string[] | readonly number[] | readonly DefaultString[] | readonly object[];
}
export declare function isValueSpecListOf<S extends ListValueSpecType>(t: ValueSpecList, s: S): t is ValueSpecListOf<S>;
export interface ListValueSpecString {
    pattern: null | string;
    "pattern-description": null | string;
    masked: boolean;
    placeholder: null | string;
}
export interface ListValueSpecNumber {
    range: string;
    integral: boolean;
    units: null | string;
    placeholder: null | string;
}
export interface ListValueSpecEnum {
    values: string[] | readonly string[];
    "value-names": {
        [value: string]: string;
    };
}
export interface ListValueSpecObject {
    spec: ConfigSpec;
    "unique-by": UniqueBy;
    "display-as": null | string;
}
export type UniqueBy = null | undefined | string | {
    any: readonly UniqueBy[] | UniqueBy[];
} | {
    all: readonly UniqueBy[] | UniqueBy[];
};
export interface ListValueSpecUnion {
    tag: UnionTagSpec;
    variants: {
        [key: string]: ConfigSpec;
    };
    "display-as": null | string;
    "unique-by": UniqueBy;
    default: string;
}
export interface UnionTagSpec {
    id: string;
    "variant-names": {
        [variant: string]: string;
    };
    name: string;
    description: null | string;
    warning: null | string;
}
export type DefaultString = string | {
    charset: string;
    len: number;
};
