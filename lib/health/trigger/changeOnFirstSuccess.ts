import { TriggerInput } from "./TriggerInput";
import { Trigger } from "./index";

export function changeOnFirstSuccess(o: {
  beforeFirstSuccess: Trigger;
  afterFirstSuccess: Trigger;
}) {
  return async function* () {
    const beforeFirstSuccess = o.beforeFirstSuccess();
    let currentValue: TriggerInput = yield;
    beforeFirstSuccess.next(currentValue);
    for (
      let res = await beforeFirstSuccess.next(currentValue);
      currentValue?.lastResult !== "success" && !res.done;
      res = await beforeFirstSuccess.next(currentValue)
    ) {
      currentValue = yield;
    }
    const afterFirstSuccess = o.afterFirstSuccess();
    for (
      let res = await afterFirstSuccess.next(currentValue);
      !res.done;
      res = await afterFirstSuccess.next(currentValue)
    ) {
      currentValue = yield;
    }
  };
}
