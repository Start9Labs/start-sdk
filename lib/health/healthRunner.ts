import { Types } from "..";
import { object, string } from "ts-matches";

export type HealthCheck = (
  effects: Types.Effects,
  dateMs: number
) => Promise<HealthResult>;
export type HealthResult =
  | { success: string }
  | { failure: string }
  | { disabled: null }
  | { starting: null }
  | { loading: string };
const hasMessage = object({ message: string }).test;
function safelyStringify(e: unknown) {
  if (hasMessage(e)) return e.message;
  if (string.test(e)) return e;
  try {
    return JSON.stringify(e);
  } catch (e) {
    return "unknown";
  }
}
async function timeoutHealth(
  effects: Types.Effects,
  timeMs: number
): Promise<HealthResult> {
  await effects.sleep(timeMs);
  return { failure: "Timed out " };
}

export default function healthRunner(
  name: string,
  fn: HealthCheck,
  { defaultIntervalS = 60 } = {}
) {
  return {
    create(effects: Types.Effects, defaultIntervalCreatedS = defaultIntervalS) {
      let running: any;
      function startFn(intervalS: number, timeoutS: number, delayS: number) {
        clearInterval(running);
        setTimeout(() => {
          running = setInterval(async () => {
            const result = await Promise.race([
              timeoutHealth(effects, timeoutS * 1000),
              fn(effects, 123),
            ]).catch((e) => {
              return { failure: safelyStringify(e) };
            });
            (effects as any).setHealthStatus({
              name,
              result,
            });
          }, intervalS * 1000);
        }, delayS * 1000);
      }

      const self = {
        stop() {
          clearInterval(running);
          return self;
        },
        start({
          intervalS = defaultIntervalCreatedS,
          timeoutS = 10,
          delayS = 0,
        } = {}) {
          startFn(intervalS, timeoutS, delayS);
          return self;
        },
      };
      return self;
    },
  };
}
