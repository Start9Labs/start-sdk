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

/**
 * Health runner is usually used during the main function, and will be running in a loop.
 * This health check then will be run every intervalS seconds.
 * The return needs a create()
 * then from there we need a start().
 * The stop function is used to stop the health check.
 */

export default function healthRunner(
  name: string,
  fn: HealthCheck,
) {
  return {
    /**
     * All values in seconds. Defaults):
     * 
     * interval: 60s
     * 
     * timeout: 10s
     * 
     * delay: 10s
     */
    create(
      effects: Types.Effects,
      options = { interval: 60, timeout: 10, delay: 10 }
    ) {
      let running: any;
      function startFn() {
        clearInterval(running);
        setTimeout(() => {
          running = setInterval(async () => {
            const result = await Promise.race([
              timeoutHealth(effects, options.timeout * 1000),
              fn(effects, 123),
            ]).catch((e) => {
              return { failure: safelyStringify(e) };
            });
            (effects as any).setHealthStatus({
              name,
              result,
            });
          }, options.interval * 1000);
        }, options.delay * 1000);
      }

      const self = {
        stop() {
          clearInterval(running);
          return self;
        },
        start() {
          startFn();
          return self;
        },
      };
      return self;
    },
  };
}
