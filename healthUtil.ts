import { Effects, ResultType } from "./types.ts";
import { error, errorCode, ok } from "./util.ts";

export const checkWebUrl: (
  url: string,
) => (effects: Effects, duration: number) => Promise<ResultType<null | void>> =
  (url) => {
    return async (effects, duration) => {
      await guardDurationAboveMinimum({ duration, minimumTime: 5000 });

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

// Ensure the starting duration is pass a minimum
export const guardDurationAboveMinimum = (
  input: { duration: number; minimumTime: number },
) =>
  (input.duration <= input.minimumTime)
    ? Promise.reject(errorCode(60, "Starting"))
    : null;
