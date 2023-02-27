import { IParser, OnParse } from "./interfaces.js";
import { Parser } from "./parser.js";
/**
 * This parser is used when trying to create parsers that
 * user their own definitions in their types, like interface Tree<Leaf> {
 *   [key: string]: Tree<Leaf> | Leaf;
 * }
 */
export declare class RecursiveParser<B> implements IParser<unknown, B> {
    readonly recursive: (parser: Parser<unknown, any>) => Parser<unknown, unknown>;
    readonly description: {
        readonly name: "Recursive";
        readonly children: readonly [];
        readonly extras: readonly [(parser: Parser<unknown, any>) => Parser<unknown, unknown>];
    };
    private parser?;
    static create<B>(fn: (parser: Parser<unknown, any>) => Parser<unknown, unknown>): RecursiveParser<B>;
    private constructor();
    parse<C, D>(a: unknown, onParse: OnParse<unknown, B, C, D>): C | D;
}
type EnsurredType<A, B = A> = (A extends never ? never : unknown) & ((parser: Parser<unknown, any>) => Parser<unknown, B>);
/**
 * Must pass the shape that we expect since typescript as of this point
 * can't infer with recursive functions like this.
 * @param fn This should be a function that takes a parser, basically the self in a type recursion, and
 * return a parser that is the combination of the recursion.
 * @returns
 */
export declare function recursive<B = never>(fn: EnsurredType<B>): Parser<unknown, B>;
export {};
