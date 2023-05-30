import * as T from "../types"

import "./nullIfEmpty"
import "./fileHelper"
import "../store/getStore"
import "./deepEqual"
import "./deepMerge"
import "./once"
import { utils } from "./utils"

// prettier-ignore
export type FlattenIntersection<T> = 
T extends ArrayLike<any> ? T :
T extends object ? {} & {[P in keyof T]: T[P]} :
 T;

export type _<T> = FlattenIntersection<T>

export const isKnownError = (e: unknown): e is T.KnownError =>
  e instanceof Object && ("error" in e || "error-code" in e)

declare const affine: unique symbol

export const createUtils = utils
export const createMainUtils = <Store>(effects: T.Effects) =>
  createUtils<Store, {}>(effects)

type NeverPossible = { [affine]: string }
export type NoAny<A> = NeverPossible extends A
  ? keyof NeverPossible extends keyof A
    ? never
    : A
  : A
