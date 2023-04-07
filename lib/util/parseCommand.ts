import { Effects } from "../types";

const match =
  (regex: RegExp) =>
  (s: string): [string, string, string] => {
    const matched = s.match(regex);
    if (matched === null) {
      return [s, "", ""];
    }
    const [
      _all,
      _firstSet,
      notQuote,
      _maybeQuote,
      doubleQuoted,
      singleQuoted,
      rest,
      noQuotes,
    ] = matched;
    const quoted = doubleQuoted || singleQuoted;
    if (!!noQuotes) {
      return [noQuotes || "", "", ""];
    }
    if (!notQuote && !quoted) {
      return [rest || "", "", ""];
    }
    return [notQuote || "", quoted || "", rest || ""];
  };
const quotes = match(/^((.*?)("([^\"]*)"|'([^\']*)')(.*)|(.*))$/);
const quoteSeperated = (s: string, quote: typeof quotes) => {
  const values = [];

  let value = quote(s);
  while (true) {
    if (value[0].length) {
      values.push(...value[0].split(" "));
    }
    if (value[1].length) {
      values.push(value[1]);
    }
    if (!value[2].length) {
      break;
    }
    value = quote(value[2]);
  }
  return values;
};

type ValidIfNoStupidEscape<A> = A extends `${string}'"'"'${string}` ? never : A;
export function parseCommand<T extends string>(
  shellCommand: ValidIfNoStupidEscape<T>
) {
  const [command, ...args] = quoteSeperated(shellCommand, quotes).filter(
    Boolean
  );
  return {
    command,
    args,
  } satisfies Parameters<Effects["runCommand"]>[0];
}
