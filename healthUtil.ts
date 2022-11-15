import { Effects, ResultType } from "./types.ts";
import { error, errorCode, isKnownError, ok } from "./util.ts";
export const checkWebUrl: (
  url: string,
) => (effects: Effects, duration: number) => Promise<ResultType<null | void>> =
  (url) => {
    return async (effects, duration) => {
      let errorValue;
      // deno-lint-ignore no-cond-assign
      if (errorValue = guardDurationAboveMinimum({ duration, minimumTime: 5000 })) return errorValue;

      return await effects.fetch(url)
        .then((_) => ok)
        .catch((e) => {
          effects.warn(`Error while fetching URL: ${url}`);
          effects.error(JSON.stringify(e));
          effects.error(e.toString());
          return error(`Error while fetching URL: ${url}`);
        });
    };
  };

export const runHealthScript =  ({command, args}: { command: string, args: string[] }) => async (effects: Effects, _duration: number): Promise<ResultType<null | void>> => {
  const res = await effects.runCommand({ command, args })
  if ('result' in res){
    return { result: null }
  } else {
    return res
  }
}

// Ensure the starting duration is pass a minimum
export const guardDurationAboveMinimum = (
  input: { duration: number; minimumTime: number },
) =>
  (input.duration <= input.minimumTime)
    ? errorCode(60, "Starting")
    : null;

export const catchError = (effects: Effects) => (e: unknown) => {
  if (isKnownError(e)) return e
  effects.error(`Health check failed: ${e}`);
  return error( "Error while running health check" );
};
