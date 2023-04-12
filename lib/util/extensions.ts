export type UnionToIntersection<T> = (
  T extends any ? (x: T) => any : never
) extends (x: infer R) => any
  ? R
  : never;
type _<A> = A;
type UnReadonly<A> = { -readonly [k in keyof A]: A[k] };
declare global {
  interface Object {
    entries<T extends {}>(
      this: T
    ): Array<{ -readonly [K in keyof T]: [K, T[K]] }[keyof T]>;
    values<T extends {}>(this: T): Array<T[keyof T]>;
    keys<T extends {}>(this: T): Array<keyof T>;
  }
  interface Array<T> {
    fromEntries(): UnionToIntersection<
      T extends [infer Key, infer Value]
        ? { [k in Key extends string | number ? Key : never]: Value }
        : never
    >;
    assignObject(): UnionToIntersection<T & {}>;
  }
}

Object.prototype.entries = function () {
  return Object.entries(this) as any;
};

Object.prototype.values = function () {
  return Object.values(this) as any;
};
Object.prototype.keys = function () {
  return Object.keys(this) as any;
};

Array.prototype.fromEntries = function () {
  return Object.fromEntries(this) as any;
};

Array.prototype.assignObject = function () {
  return Object.assign({}, ...this) as any;
};
