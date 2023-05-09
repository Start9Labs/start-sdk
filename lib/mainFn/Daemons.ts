import { HealthReceipt } from "../health/HealthReceipt"
import { CheckResult } from "../health/checkFns"
import { Trigger } from "../trigger"
import { TriggerInput } from "../trigger/TriggerInput"
import { defaultTrigger } from "../trigger/defaultTrigger"
import { DaemonReturned, Effects, ValidIfNoStupidEscape } from "../types"
import { InterfaceReceipt } from "./interfaceReceipt"
type Daemon<Ids extends string, Command extends string, Id extends string> = {
  id: "" extends Id ? never : Id
  command: ValidIfNoStupidEscape<Command> | [string, ...string[]]
  env?: Record<string, string>
  ready: {
    display: string | null
    fn: () => Promise<CheckResult> | CheckResult
    trigger?: Trigger
  }
  requires: Exclude<Ids, Id>[]
}

type ErrorDuplicateId<Id extends string> = `The id '${Id}' is already used`
/**
 * A class for defining and controlling the service daemons
```ts
Daemons.of({
  effects,
  started,
  interfaceReceipt, // Provide the interfaceReceipt to prove it was completed
  healthReceipts, // Provide the healthReceipts or [] to prove they were at least considered
}).addDaemon('webui', {
  command: 'hello-world', // The command to start the daemon
  ready: {
    display: 'Web Interface',
    // The function to run to determine the health status of the daemon
    fn: () =>
      checkPortListening(effects, 80, {
        successMessage: 'The web interface is ready',
        errorMessage: 'The web interface is not ready',
      }),
  },
  requires: [],
})
```
 */
export class Daemons<Ids extends string> {
  private constructor(
    readonly effects: Effects,
    readonly started: (onTerm: () => void) => null,
    readonly daemons?: Daemon<Ids, "command", Ids>[],
  ) {}
  /**
   * Returns an empty new Daemons class with the provided config.
   *
   * Call .addDaemon() on the returned class to add a daemon.
   *
   * Daemons run in the order they are defined, with latter daemons being capable of
   * depending on prior daemons
   * @param config
   * @returns
   */
  static of(config: {
    effects: Effects
    started: (onTerm: () => void) => null
    interfaceReceipt: InterfaceReceipt
    healthReceipts: HealthReceipt[]
  }) {
    return new Daemons<never>(config.effects, config.started)
  }
  /**
   * Returns the complete list of daemons, including the one defined here
   * @param id
   * @param newDaemon
   * @returns
   */
  addDaemon<Id extends string, Command extends string>(
    // prettier-ignore
    id: 
      "" extends Id ? never :
      ErrorDuplicateId<Id> extends Id ? never :
      Id extends Ids ? ErrorDuplicateId<Id> :
      Id,
    newDaemon: Omit<Daemon<Ids, Command, Id>, "id">,
  ) {
    const daemons = ((this?.daemons ?? []) as any[]).concat({
      ...newDaemon,
      id,
    })
    return new Daemons<Ids | Id>(this.effects, this.started, daemons)
  }

  async build() {
    const daemonsStarted = {} as Record<Ids, Promise<DaemonReturned>>
    const { effects } = this
    const daemons = this.daemons ?? []
    for (const daemon of daemons) {
      const requiredPromise = Promise.all(
        daemon.requires?.map((id) => daemonsStarted[id]) ?? [],
      )
      daemonsStarted[daemon.id] = requiredPromise.then(async () => {
        const { command } = daemon

        const child = effects.runDaemon(command, { env: daemon.env })
        let currentInput: TriggerInput = {}
        const getCurrentInput = () => currentInput
        const trigger = (daemon.ready.trigger ?? defaultTrigger)(
          getCurrentInput,
        )
        return new Promise(async (resolve) => {
          for (
            let res = await trigger.next();
            !res.done;
            res = await trigger.next()
          ) {
            const response = await Promise.resolve(daemon.ready.fn()).catch(
              (err) =>
                ({
                  status: "failing",
                  message: "message" in err ? err.message : String(err),
                } as CheckResult),
            )
            currentInput.lastResult = response.status || null
            if (!currentInput.hadSuccess && response.status === "passing") {
              currentInput.hadSuccess = true
              resolve(child)
            }
          }
          resolve(child)
        })
      })
    }
    return {
      async term() {
        await Promise.all(
          Object.values<Promise<DaemonReturned>>(daemonsStarted).map((x) =>
            x.then((x) => x.term()),
          ),
        )
      },
      async wait() {
        await Promise.all(
          Object.values<Promise<DaemonReturned>>(daemonsStarted).map((x) =>
            x.then((x) => x.wait()),
          ),
        )
      },
    }
  }
}
