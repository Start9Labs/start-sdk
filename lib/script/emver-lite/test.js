"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dntShim = __importStar(require("../_dnt.test_shims.js"));
const mod_js_1 = require("../deps/deno.land/x/expect@v0.2.9/mod.js");
const mod_js_2 = require("./mod.js");
const { test } = dntShim.Deno;
{
    const checker = (0, mod_js_2.rangeOf)("*");
    test("rangeOf('*')", () => {
        (0, mod_js_1.expect)(checker.check("1")).toBe(true);
        (0, mod_js_1.expect)(checker.check("1.2")).toBe(true);
        (0, mod_js_1.expect)(checker.check("1.2.3.4")).toBe(true);
    });
    test("rangeOf('*') invalid", () => {
        (0, mod_js_1.expect)(() => checker.check("a")).toThrow();
        (0, mod_js_1.expect)(() => checker.check("")).toThrow();
        (0, mod_js_1.expect)(() => checker.check("1..3")).toThrow();
    });
}
{
    const checker = (0, mod_js_2.rangeOf)(">1.2.3.4");
    test(`rangeOf(">1.2.3.4") valid`, () => {
        (0, mod_js_1.expect)(checker.check("2")).toBe(true);
        (0, mod_js_1.expect)(checker.check("1.2.3.5")).toBe(true);
        (0, mod_js_1.expect)(checker.check("1.2.3.4.1")).toBe(true);
    });
    test(`rangeOf(">1.2.3.4") invalid`, () => {
        (0, mod_js_1.expect)(checker.check("1.2.3.4")).toBe(false);
        (0, mod_js_1.expect)(checker.check("1.2.3")).toBe(false);
        (0, mod_js_1.expect)(checker.check("1")).toBe(false);
    });
}
{
    const checker = (0, mod_js_2.rangeOf)("=1.2.3");
    test(`rangeOf("=1.2.3") valid`, () => {
        (0, mod_js_1.expect)(checker.check("1.2.3")).toBe(true);
    });
    test(`rangeOf("=1.2.3") invalid`, () => {
        (0, mod_js_1.expect)(checker.check("2")).toBe(false);
        (0, mod_js_1.expect)(checker.check("1.2.3.1")).toBe(false);
        (0, mod_js_1.expect)(checker.check("1.2")).toBe(false);
    });
}
{
    const checker = (0, mod_js_2.rangeOf)(">=1.2.3.4");
    test(`rangeOf(">=1.2.3.4") valid`, () => {
        (0, mod_js_1.expect)(checker.check("2")).toBe(true);
        (0, mod_js_1.expect)(checker.check("1.2.3.5")).toBe(true);
        (0, mod_js_1.expect)(checker.check("1.2.3.4.1")).toBe(true);
        (0, mod_js_1.expect)(checker.check("1.2.3.4")).toBe(true);
    });
    test(`rangeOf(">=1.2.3.4") invalid`, () => {
        (0, mod_js_1.expect)(checker.check("1.2.3")).toBe(false);
        (0, mod_js_1.expect)(checker.check("1")).toBe(false);
    });
}
{
    const checker = (0, mod_js_2.rangeOf)("<1.2.3.4");
    test(`rangeOf("<1.2.3.4") invalid`, () => {
        (0, mod_js_1.expect)(checker.check("2")).toBe(false);
        (0, mod_js_1.expect)(checker.check("1.2.3.5")).toBe(false);
        (0, mod_js_1.expect)(checker.check("1.2.3.4.1")).toBe(false);
        (0, mod_js_1.expect)(checker.check("1.2.3.4")).toBe(false);
    });
    test(`rangeOf("<1.2.3.4") valid`, () => {
        (0, mod_js_1.expect)(checker.check("1.2.3")).toBe(true);
        (0, mod_js_1.expect)(checker.check("1")).toBe(true);
    });
}
{
    const checker = (0, mod_js_2.rangeOf)("<=1.2.3.4");
    test(`rangeOf("<=1.2.3.4") invalid`, () => {
        (0, mod_js_1.expect)(checker.check("2")).toBe(false);
        (0, mod_js_1.expect)(checker.check("1.2.3.5")).toBe(false);
        (0, mod_js_1.expect)(checker.check("1.2.3.4.1")).toBe(false);
    });
    test(`rangeOf("<=1.2.3.4") valid`, () => {
        (0, mod_js_1.expect)(checker.check("1.2.3")).toBe(true);
        (0, mod_js_1.expect)(checker.check("1")).toBe(true);
        (0, mod_js_1.expect)(checker.check("1.2.3.4")).toBe(true);
    });
}
{
    const checkA = (0, mod_js_2.rangeOf)(">1");
    const checkB = (0, mod_js_2.rangeOf)("<=2");
    const checker = (0, mod_js_2.rangeAnd)(checkA, checkB);
    test(`simple and(checkers) valid`, () => {
        (0, mod_js_1.expect)(checker.check("2")).toBe(true);
        (0, mod_js_1.expect)(checker.check("1.1")).toBe(true);
    });
    test(`simple and(checkers) invalid`, () => {
        (0, mod_js_1.expect)(checker.check("2.1")).toBe(false);
        (0, mod_js_1.expect)(checker.check("1")).toBe(false);
        (0, mod_js_1.expect)(checker.check("0")).toBe(false);
    });
}
{
    const checkA = (0, mod_js_2.rangeOf)("<1");
    const checkB = (0, mod_js_2.rangeOf)("=2");
    const checker = (0, mod_js_2.rangeOr)(checkA, checkB);
    test(`simple or(checkers) valid`, () => {
        (0, mod_js_1.expect)(checker.check("2")).toBe(true);
        (0, mod_js_1.expect)(checker.check("0.1")).toBe(true);
    });
    test(`simple or(checkers) invalid`, () => {
        (0, mod_js_1.expect)(checker.check("2.1")).toBe(false);
        (0, mod_js_1.expect)(checker.check("1")).toBe(false);
        (0, mod_js_1.expect)(checker.check("1.1")).toBe(false);
    });
}
{
    const checker = (0, mod_js_2.rangeOf)("1.2.*");
    test(`rangeOf(1.2.*) valid`, () => {
        (0, mod_js_1.expect)(checker.check("1.2")).toBe(true);
        (0, mod_js_1.expect)(checker.check("1.2.1")).toBe(true);
    });
    test(`rangeOf(1.2.*) invalid`, () => {
        (0, mod_js_1.expect)(checker.check("1.3")).toBe(false);
        (0, mod_js_1.expect)(checker.check("1.3.1")).toBe(false);
        (0, mod_js_1.expect)(checker.check("1.1.1")).toBe(false);
        (0, mod_js_1.expect)(checker.check("1.1")).toBe(false);
        (0, mod_js_1.expect)(checker.check("1")).toBe(false);
        (0, mod_js_1.expect)(checker.check("2")).toBe(false);
    });
}
{
    const checker = (0, mod_js_2.notRange)((0, mod_js_2.rangeOf)("1.2.*"));
    test(`notRange(rangeOf(1.2.*)) valid`, () => {
        (0, mod_js_1.expect)(checker.check("1.3")).toBe(true);
        (0, mod_js_1.expect)(checker.check("1.3.1")).toBe(true);
        (0, mod_js_1.expect)(checker.check("1.1.1")).toBe(true);
        (0, mod_js_1.expect)(checker.check("1.1")).toBe(true);
        (0, mod_js_1.expect)(checker.check("1")).toBe(true);
        (0, mod_js_1.expect)(checker.check("2")).toBe(true);
    });
    test(`notRange(rangeOf(1.2.*)) invalid `, () => {
        (0, mod_js_1.expect)(checker.check("1.2")).toBe(false);
        (0, mod_js_1.expect)(checker.check("1.2.1")).toBe(false);
    });
}
{
    const checker = (0, mod_js_2.rangeOf)("!1.2.*");
    test(`!(rangeOf(1.2.*)) valid`, () => {
        (0, mod_js_1.expect)(checker.check("1.3")).toBe(true);
        (0, mod_js_1.expect)(checker.check("1.3.1")).toBe(true);
        (0, mod_js_1.expect)(checker.check("1.1.1")).toBe(true);
        (0, mod_js_1.expect)(checker.check("1.1")).toBe(true);
        (0, mod_js_1.expect)(checker.check("1")).toBe(true);
        (0, mod_js_1.expect)(checker.check("2")).toBe(true);
    });
    test(`!(rangeOf(1.2.*)) invalid `, () => {
        (0, mod_js_1.expect)(checker.check("1.2")).toBe(false);
        (0, mod_js_1.expect)(checker.check("1.2.1")).toBe(false);
    });
}
{
    test(`no and ranges`, () => {
        (0, mod_js_1.expect)(() => (0, mod_js_2.rangeAnd)()).toThrow();
    });
    test(`no or ranges`, () => {
        (0, mod_js_1.expect)(() => (0, mod_js_2.rangeOr)()).toThrow();
    });
}
{
    const checker = (0, mod_js_2.rangeOf)("!>1.2.3.4");
    test(`rangeOf("!>1.2.3.4") invalid`, () => {
        (0, mod_js_1.expect)(checker.check("2")).toBe(false);
        (0, mod_js_1.expect)(checker.check("1.2.3.5")).toBe(false);
        (0, mod_js_1.expect)(checker.check("1.2.3.4.1")).toBe(false);
    });
    test(`rangeOf("!>1.2.3.4") valid`, () => {
        (0, mod_js_1.expect)(checker.check("1.2.3.4")).toBe(true);
        (0, mod_js_1.expect)(checker.check("1.2.3")).toBe(true);
        (0, mod_js_1.expect)(checker.check("1")).toBe(true);
    });
}
test(">1 && =1.2", () => {
    const checker = (0, mod_js_2.rangeOf)(">1 && =1.2");
    (0, mod_js_1.expect)(checker.check("1.2")).toBe(true);
    (0, mod_js_1.expect)(checker.check("1.2.1")).toBe(false);
});
test("=1 || =2", () => {
    const checker = (0, mod_js_2.rangeOf)("=1 || =2");
    (0, mod_js_1.expect)(checker.check("1")).toBe(true);
    (0, mod_js_1.expect)(checker.check("2")).toBe(true);
    (0, mod_js_1.expect)(checker.check("3")).toBe(false);
});
test(">1 && =1.2 || =2", () => {
    const checker = (0, mod_js_2.rangeOf)(">1 && =1.2 || =2");
    (0, mod_js_1.expect)(checker.check("1.2")).toBe(true);
    (0, mod_js_1.expect)(checker.check("1")).toBe(false);
    (0, mod_js_1.expect)(checker.check("2")).toBe(true);
    (0, mod_js_1.expect)(checker.check("3")).toBe(false);
});
test("&& before || order of operationns:  <1.5 && >1 || >1.5 && <3", () => {
    const checker = (0, mod_js_2.rangeOf)("<1.5 && >1 || >1.5 && <3");
    (0, mod_js_1.expect)(checker.check("1.1")).toBe(true);
    (0, mod_js_1.expect)(checker.check("2")).toBe(true);
    (0, mod_js_1.expect)(checker.check("1.5")).toBe(false);
    (0, mod_js_1.expect)(checker.check("1")).toBe(false);
    (0, mod_js_1.expect)(checker.check("3")).toBe(false);
});
test("Compare function on the emver", () => {
    const a = mod_js_2.EmVer.from("1.2.3");
    const b = mod_js_2.EmVer.from("1.2.4");
    (0, mod_js_1.expect)(a.compare(b) === "less");
    (0, mod_js_1.expect)(b.compare(a) === "greater");
    (0, mod_js_1.expect)(a.compare(a) === "equal");
});
test("Compare for sort function on the emver", () => {
    const a = mod_js_2.EmVer.from("1.2.3");
    const b = mod_js_2.EmVer.from("1.2.4");
    (0, mod_js_1.expect)(a.compareForSort(b) === -1);
    (0, mod_js_1.expect)(b.compareForSort(a) === 1);
    (0, mod_js_1.expect)(a.compareForSort(a) === 0);
});
