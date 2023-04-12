import {
  PackagePropertiesV2,
  PackagePropertyObject,
  PackagePropertyString,
  Properties as P,
} from "../types";
import { PropertyObject } from "./PropertyObject";
import { PropertyString } from "./PropertyString";

export class Properties<X extends PackagePropertiesV2> {
  constructor(readonly data: X) {}

  static of<
    X extends Record<
      string,
      | PropertyObject<PackagePropertyObject>
      | PropertyString<PackagePropertyString>
    >
  >(x: X) {
    const answer = {} as {
      [key in keyof X]: X[key]["data"];
    };

    for (const [key, value] of x.entries()) {
      answer[key] = value.data;
    }
    return new Properties(answer);
  }

  build() {
    return {
      version: 2,
      data: this.data,
    } satisfies P;
  }
}
