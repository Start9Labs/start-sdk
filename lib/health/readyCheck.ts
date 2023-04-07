import { InterfaceReceipt } from "../mainFn/interfaceReceipt";
import { Daemon, Effects } from "../types";
import { CheckResult } from "./checkFns/CheckResult";
import { ReadyReceipt } from "./ReadyProof";
import { HealthReceipt } from "./HealthReceipt";
import { Trigger } from "./trigger";
import { TriggerInput } from "./trigger/TriggerInput";
import { defaultTrigger } from "./trigger/defaultTrigger";

function readReciptOf<A extends { daemon: Daemon }>(a: A) {
  return a as A & ReadyReceipt;
}
export function readyCheck(o: {
  effects: Effects;
  started(onTerm: () => void): null;
  interfaceReceipt: InterfaceReceipt;
  healthReceipts: Iterable<HealthReceipt>;
  daemonReceipt: Daemon;
  name: string;
  trigger?: Trigger;
  fn(): Promise<CheckResult> | CheckResult;
  onFirstSuccess?: () => () => Promise<unknown> | unknown;
}) {
  new Promise(async () => {
    const trigger = (o.trigger ?? defaultTrigger)();
    let currentValue: TriggerInput = {
      lastResult: null,
      hadSuccess: false,
    };
    for (
      let res = await trigger.next(currentValue);
      !res.done;
      res = await trigger.next(currentValue)
    ) {
      try {
        const { status, message } = await o.fn();
        if (!currentValue.hadSuccess) {
          await o.started(o?.onFirstSuccess ?? (() => o.daemonReceipt.term()));
        }
        await o.effects.setHealth({
          name: o.name,
          status,
          message,
        });
        currentValue.hadSuccess = true;
        currentValue.lastResult = "success";
      } catch (_) {
        currentValue.lastResult = "failure";
      }
    }
  });
  return readReciptOf({
    daemon: o.daemonReceipt,
  });
}
