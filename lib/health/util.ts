import { Effects, ResultType } from "../types";
import { error, errorCode, isKnownError, ok, okOf } from "../util";
import { HealthResult } from "./healthRunner";

/**
 * This is a helper function to check if a web url is reachable.
 * @param url
 * @param createSuccess
 * @returns
 */
export const checkWebUrl: (
  url: string,
  createSuccess?: null | ((response?: string | null) => string),
) => (
  effects: Effects,
  duration: number,
) => Promise<ResultType<HealthResult>> = (url, createSuccess = null) => {
  return async (effects, duration) => {
    let errorValue;
    if (
      (errorValue = guardDurationAboveMinimum({ duration, minimumTime: 5000 }))
    ) {
      return errorValue;
    }

    return await effects
      .fetch(url)
      .then((x) =>
        okOf({
          success:
            createSuccess?.(x.body) ?? `Successfully fetched URL: ${url}`,
        }),
      )
      .catch((e) => {
        effects.warn(`Error while fetching URL: ${url}`);
        effects.error(JSON.stringify(e));
        effects.error(e.toString());
        return error(`Error while fetching URL: ${url}`);
      });
  };
};

/**
 * Running a health script, is used when we want to have a simple
 * script in bash or something like that. It should return something that is useful
 * in {result: string} else it is considered an error
 * @param param0
 * @returns
 */
export const runHealthScript =
  ({
    command,
    args,
    message,
  }: {
    command: string;
    args: string[];
    message: ((result: unknown) => string) | null;
  }) =>
  async (
    effects: Effects,
    _duration: number,
  ): Promise<ResultType<HealthResult>> => {
    const res = await effects.runCommand({ command, args });
    if ("result" in res) {
      return {
        result: {
          success:
            message?.(res) ??
            `Have ran script ${command} and the result: ${res.result}`,
        },
      };
    } else {
      throw res;
    }
  };

// Ensure the starting duration is pass a minimum
export const guardDurationAboveMinimum = (input: {
  duration: number;
  minimumTime: number;
}) => (input.duration <= input.minimumTime ? errorCode(60, "Starting") : null);

export const catchError = (effects: Effects) => (e: unknown) => {
  if (isKnownError(e)) return e;
  effects.error(`Health check failed: ${e}`);
  return error("Error while running health check");
};
