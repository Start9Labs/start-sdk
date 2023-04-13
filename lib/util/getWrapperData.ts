import { Parser } from "ts-matches";
import { Effects } from "../types";

export function getWrapperData<A>(
  effects: Effects,
  validator: Parser<unknown, A>,
  options: {
    /** Defaults to what ever the package currently in */
    packageId?: string | undefined;
    /** JsonPath */
    path?: string | undefined;
  } = {}
) {
  return {
    const: () =>
      effects
        .getWrapperData({
          ...options,
          callback: effects.restart,
        })
        .then(validator.unsafeCast),
    first: () =>
      effects
        .getWrapperData({
          ...options,
          callback: () => {},
        })
        .then(validator.unsafeCast),
    overTime: async function* <A>() {
      while (true) {
        let callback: () => void;
        const waitForNext = new Promise<void>((resolve) => {
          callback = resolve;
        });
        yield await effects
          .getWrapperData({
            ...options,
            callback: () => callback(),
          })
          .then(validator.unsafeCast);
        await waitForNext;
      }
    },
  };
}
