import { CommandType, Effects } from "../../types";
import { CheckResult } from "./CheckResult";
import { timeoutPromise } from "./index";

/**
 * Running a health script, is used when we want to have a simple
 * script in bash or something like that. It should return something that is useful
 * in {result: string} else it is considered an error
 * @param param0
 * @returns
 */
export const runHealthScript = async <A extends string>(
  effects: Effects,
  runCommand: CommandType<A>,
  {
    timeout = 30000,
    errorMessage = `Error while running command: ${runCommand}`,
    message = (res: string) =>
      `Have ran script ${runCommand} and the result: ${res}`,
  } = {}
): Promise<CheckResult> => {
  const res = await Promise.race([
    effects.runCommand(runCommand, { timeoutMillis: timeout }),
    timeoutPromise(timeout),
  ]).catch((e) => {
    effects.warn(errorMessage);
    effects.warn(JSON.stringify(e));
    effects.warn(e.toString());
    throw { status: "failing", message: errorMessage } as CheckResult;
  });
  return {
    status: "passing",
    message: message(res),
  } as CheckResult;
};
