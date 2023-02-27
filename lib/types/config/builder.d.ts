export declare class IBuilder<A> {
    readonly a: A;
    protected constructor(a: A);
    build(): A;
}
export type BuilderExtract<A> = A extends IBuilder<infer B> ? B : never;
