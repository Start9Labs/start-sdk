"use strict";
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNegativeZero = exports.repeat = exports.toArray = exports.isRegExp = exports.isFunction = exports.isError = exports.isObject = exports.isUndefined = exports.isSymbol = exports.isString = exports.isNumber = exports.isNull = exports.isBoolean = exports.isArray = exports.isNothing = void 0;
function isNothing(subject) {
    return typeof subject === "undefined" || subject === null;
}
exports.isNothing = isNothing;
function isArray(value) {
    return Array.isArray(value);
}
exports.isArray = isArray;
function isBoolean(value) {
    return typeof value === "boolean" || value instanceof Boolean;
}
exports.isBoolean = isBoolean;
function isNull(value) {
    return value === null;
}
exports.isNull = isNull;
function isNumber(value) {
    return typeof value === "number" || value instanceof Number;
}
exports.isNumber = isNumber;
function isString(value) {
    return typeof value === "string" || value instanceof String;
}
exports.isString = isString;
function isSymbol(value) {
    return typeof value === "symbol";
}
exports.isSymbol = isSymbol;
function isUndefined(value) {
    return value === undefined;
}
exports.isUndefined = isUndefined;
function isObject(value) {
    return value !== null && typeof value === "object";
}
exports.isObject = isObject;
function isError(e) {
    return e instanceof Error;
}
exports.isError = isError;
function isFunction(value) {
    return typeof value === "function";
}
exports.isFunction = isFunction;
function isRegExp(value) {
    return value instanceof RegExp;
}
exports.isRegExp = isRegExp;
function toArray(sequence) {
    if (isArray(sequence))
        return sequence;
    if (isNothing(sequence))
        return [];
    return [sequence];
}
exports.toArray = toArray;
function repeat(str, count) {
    let result = "";
    for (let cycle = 0; cycle < count; cycle++) {
        result += str;
    }
    return result;
}
exports.repeat = repeat;
function isNegativeZero(i) {
    return i === 0 && Number.NEGATIVE_INFINITY === 1 / i;
}
exports.isNegativeZero = isNegativeZero;
