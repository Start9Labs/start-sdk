import * as dntShim from "../_dnt.test_shims.js";
import { expect } from "../deps/deno.land/x/expect@v0.2.9/mod.js";
import { EmVer, notRange, rangeAnd, rangeOf, rangeOr } from "./mod.js";
const { test } = dntShim.Deno;

{
  const checker = rangeOf("*");
  test("rangeOf('*')", () => {
    expect(checker.check("1")).toBe(true);
    expect(checker.check("1.2")).toBe(true);
    expect(checker.check("1.2.3.4")).toBe(true);
  });
  test("rangeOf('*') invalid", () => {
    expect(() => checker.check("a")).toThrow();
    expect(() => checker.check("")).toThrow();
    expect(() => checker.check("1..3")).toThrow();
  });
}

{
  const checker = rangeOf(">1.2.3.4");
  test(`rangeOf(">1.2.3.4") valid`, () => {
    expect(checker.check("2")).toBe(true);
    expect(checker.check("1.2.3.5")).toBe(true);
    expect(checker.check("1.2.3.4.1")).toBe(true);
  });

  test(`rangeOf(">1.2.3.4") invalid`, () => {
    expect(checker.check("1.2.3.4")).toBe(false);
    expect(checker.check("1.2.3")).toBe(false);
    expect(checker.check("1")).toBe(false);
  });
}
{
  const checker = rangeOf("=1.2.3");
  test(`rangeOf("=1.2.3") valid`, () => {
    expect(checker.check("1.2.3")).toBe(true);
  });

  test(`rangeOf("=1.2.3") invalid`, () => {
    expect(checker.check("2")).toBe(false);
    expect(checker.check("1.2.3.1")).toBe(false);
    expect(checker.check("1.2")).toBe(false);
  });
}
{
  const checker = rangeOf(">=1.2.3.4");
  test(`rangeOf(">=1.2.3.4") valid`, () => {
    expect(checker.check("2")).toBe(true);
    expect(checker.check("1.2.3.5")).toBe(true);
    expect(checker.check("1.2.3.4.1")).toBe(true);
    expect(checker.check("1.2.3.4")).toBe(true);
  });

  test(`rangeOf(">=1.2.3.4") invalid`, () => {
    expect(checker.check("1.2.3")).toBe(false);
    expect(checker.check("1")).toBe(false);
  });
}
{
  const checker = rangeOf("<1.2.3.4");
  test(`rangeOf("<1.2.3.4") invalid`, () => {
    expect(checker.check("2")).toBe(false);
    expect(checker.check("1.2.3.5")).toBe(false);
    expect(checker.check("1.2.3.4.1")).toBe(false);
    expect(checker.check("1.2.3.4")).toBe(false);
  });

  test(`rangeOf("<1.2.3.4") valid`, () => {
    expect(checker.check("1.2.3")).toBe(true);
    expect(checker.check("1")).toBe(true);
  });
}
{
  const checker = rangeOf("<=1.2.3.4");
  test(`rangeOf("<=1.2.3.4") invalid`, () => {
    expect(checker.check("2")).toBe(false);
    expect(checker.check("1.2.3.5")).toBe(false);
    expect(checker.check("1.2.3.4.1")).toBe(false);
  });

  test(`rangeOf("<=1.2.3.4") valid`, () => {
    expect(checker.check("1.2.3")).toBe(true);
    expect(checker.check("1")).toBe(true);
    expect(checker.check("1.2.3.4")).toBe(true);
  });
}

{
  const checkA = rangeOf(">1");
  const checkB = rangeOf("<=2");

  const checker = rangeAnd(checkA, checkB);
  test(`simple and(checkers) valid`, () => {
    expect(checker.check("2")).toBe(true);

    expect(checker.check("1.1")).toBe(true);
  });
  test(`simple and(checkers) invalid`, () => {
    expect(checker.check("2.1")).toBe(false);
    expect(checker.check("1")).toBe(false);
    expect(checker.check("0")).toBe(false);
  });
}
{
  const checkA = rangeOf("<1");
  const checkB = rangeOf("=2");

  const checker = rangeOr(checkA, checkB);
  test(`simple or(checkers) valid`, () => {
    expect(checker.check("2")).toBe(true);
    expect(checker.check("0.1")).toBe(true);
  });
  test(`simple or(checkers) invalid`, () => {
    expect(checker.check("2.1")).toBe(false);
    expect(checker.check("1")).toBe(false);
    expect(checker.check("1.1")).toBe(false);
  });
}
{
  const checker = rangeOf("1.2.*");
  test(`rangeOf(1.2.*) valid`, () => {
    expect(checker.check("1.2")).toBe(true);
    expect(checker.check("1.2.1")).toBe(true);
  });
  test(`rangeOf(1.2.*) invalid`, () => {
    expect(checker.check("1.3")).toBe(false);
    expect(checker.check("1.3.1")).toBe(false);

    expect(checker.check("1.1.1")).toBe(false);
    expect(checker.check("1.1")).toBe(false);
    expect(checker.check("1")).toBe(false);

    expect(checker.check("2")).toBe(false);
  });
}

{
  const checker = notRange(rangeOf("1.2.*"));
  test(`notRange(rangeOf(1.2.*)) valid`, () => {
    expect(checker.check("1.3")).toBe(true);
    expect(checker.check("1.3.1")).toBe(true);

    expect(checker.check("1.1.1")).toBe(true);
    expect(checker.check("1.1")).toBe(true);
    expect(checker.check("1")).toBe(true);

    expect(checker.check("2")).toBe(true);
  });
  test(`notRange(rangeOf(1.2.*)) invalid `, () => {
    expect(checker.check("1.2")).toBe(false);
    expect(checker.check("1.2.1")).toBe(false);
  });
}

{
  const checker = rangeOf("!1.2.*");
  test(`!(rangeOf(1.2.*)) valid`, () => {
    expect(checker.check("1.3")).toBe(true);
    expect(checker.check("1.3.1")).toBe(true);

    expect(checker.check("1.1.1")).toBe(true);
    expect(checker.check("1.1")).toBe(true);
    expect(checker.check("1")).toBe(true);

    expect(checker.check("2")).toBe(true);
  });
  test(`!(rangeOf(1.2.*)) invalid `, () => {
    expect(checker.check("1.2")).toBe(false);
    expect(checker.check("1.2.1")).toBe(false);
  });
}

{
  test(`no and ranges`, () => {
    expect(() => rangeAnd()).toThrow();
  });
  test(`no or ranges`, () => {
    expect(() => rangeOr()).toThrow();
  });
}
{
  const checker = rangeOf("!>1.2.3.4");
  test(`rangeOf("!>1.2.3.4") invalid`, () => {
    expect(checker.check("2")).toBe(false);
    expect(checker.check("1.2.3.5")).toBe(false);
    expect(checker.check("1.2.3.4.1")).toBe(false);
  });

  test(`rangeOf("!>1.2.3.4") valid`, () => {
    expect(checker.check("1.2.3.4")).toBe(true);
    expect(checker.check("1.2.3")).toBe(true);
    expect(checker.check("1")).toBe(true);
  });
}

test(">1 && =1.2", () => {
  const checker = rangeOf(">1 && =1.2");

  expect(checker.check("1.2")).toBe(true);
  expect(checker.check("1.2.1")).toBe(false);
});
test("=1 || =2", () => {
  const checker = rangeOf("=1 || =2");

  expect(checker.check("1")).toBe(true);
  expect(checker.check("2")).toBe(true);
  expect(checker.check("3")).toBe(false);
});

test(">1 && =1.2 || =2", () => {
  const checker = rangeOf(">1 && =1.2 || =2");

  expect(checker.check("1.2")).toBe(true);
  expect(checker.check("1")).toBe(false);
  expect(checker.check("2")).toBe(true);
  expect(checker.check("3")).toBe(false);
});

test("&& before || order of operationns:  <1.5 && >1 || >1.5 && <3", () => {
  const checker = rangeOf("<1.5 && >1 || >1.5 && <3");
  expect(checker.check("1.1")).toBe(true);
  expect(checker.check("2")).toBe(true);

  expect(checker.check("1.5")).toBe(false);
  expect(checker.check("1")).toBe(false);
  expect(checker.check("3")).toBe(false);
});

test("Compare function on the emver", () => {
  const a = EmVer.from("1.2.3");
  const b = EmVer.from("1.2.4");

  expect(a.compare(b) === "less");
  expect(b.compare(a) === "greater");
  expect(a.compare(a) === "equal");
});
test("Compare for sort function on the emver", () => {
  const a = EmVer.from("1.2.3");
  const b = EmVer.from("1.2.4");

  expect(a.compareForSort(b) === -1);
  expect(b.compareForSort(a) === 1);
  expect(a.compareForSort(a) === 0);
});
