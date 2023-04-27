import { InterfaceReceipt } from "../mainFn/interfaceReceipt"
import { Daemon, Effects } from "../types"
import { CheckResult } from "./checkFns/CheckResult"
import { HealthReceipt } from "./HealthReceipt"
import { Trigger } from "./trigger"
import { TriggerInput } from "./trigger/TriggerInput"
import { defaultTrigger } from "./trigger/defaultTrigger"

export function healthCheck(o: {
  effects: Effects
  name: string
  trigger?: Trigger
  fn(): Promise<CheckResult> | CheckResult
  onFirstSuccess?: () => () => Promise<unknown> | unknown
}) {
  new Promise(async () => {
    let currentValue: TriggerInput = {
      hadSuccess: false,
    }
    const getCurrentValue = () => currentValue
    const trigger = (o.trigger ?? defaultTrigger)(getCurrentValue)
    for (
      let res = await trigger.next();
      !res.done;
      res = await trigger.next()
    ) {
      try {
        const { status, message } = await o.fn()
        await o.effects.setHealth({
          name: o.name,
          status,
          message,
        })
        currentValue.hadSuccess = true
        currentValue.lastResult = "passing"
      } catch (_) {
        currentValue.lastResult = "failing"
      }
    }
  })
  return {} as HealthReceipt
}
