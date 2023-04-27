import { _ } from "../../util"
export class IBuilder<A> {
  protected constructor(readonly a: A) {}

  public build(): A {
    return this.a
  }
}

export type BuilderExtract<A> = A extends IBuilder<infer B> ? B : never
