import { HealthReceipt, ReadyProof } from "../health";
import { CheckResult } from "../health/checkFns";
import { Trigger } from "../health/trigger";
import { defaultTrigger } from "../health/trigger/defaultTrigger";
import { DaemonReturned, Effects, ValidIfNoStupidEscape } from "../types";
import { InterfaceReceipt } from "./interfaceReceipt";
type Daemon<
  Ids extends string | never,
  Command extends string,
  Id extends string,
> = {
  id: Id;
  command: ValidIfNoStupidEscape<Command> | [string, ...string[]];

  ready: {
    display: null | {
      name: string;
      message: string;
    };
    fn: () => Promise<CheckResult> | CheckResult;
    trigger?: Trigger;
  };
  requires?: Exclude<Ids, Id>[];
  intervalTime?: number;
};

/**
 * Used during the main of a function, it allows us to describe and ensure a set of daemons are running.
 * With the dependency, we are using this like an init system, where we can ensure that a daemon is running
 * The return type of this is used in the runningMain
```ts
Daemons.with({
    effects,
    started,
    interfacesReceipt,
  })
  .addDaemon({
    id: "nostr",
    command: "./nostr-rs-relay --db /data",
    ready: {
      display: {
        name: "Websocket Live",
        message: "The websocket is live",
      },
      fn: () => checkPortListening(effects, 8080),
    },
  })
  .build()
```
 */
export class Daemons<Ids extends string | never> {
  private constructor(
    readonly effects: Effects,
    readonly started: (onTerm: () => void) => null,
    readonly daemons?: Daemon<Ids, "command", Ids>[],
  ) {}

  static of(config: {
    effects: Effects;
    started: (onTerm: () => void) => null;
    interfaceReceipt: InterfaceReceipt;
    healthReceipts: HealthReceipt[];
  }) {
    return new Daemons<never>(config.effects, config.started);
  }
  addDaemon<Id extends string, Command extends string>(
    newDaemon: Daemon<Ids, Command, Id>,
  ) {
    const daemons = ((this?.daemons ?? []) as any[]).concat(newDaemon);
    return new Daemons<Ids | Id>(this.effects, this.started, daemons);
  }

  async build() {
    const daemonsStarted = {} as Record<Ids, Promise<DaemonReturned>>;
    const { effects } = this;
    const daemons = this.daemons ?? [];
    for (const daemon of daemons) {
      const requiredPromise = Promise.all(
        daemon.requires?.map((id) => daemonsStarted[id]) ?? [],
      );
      daemonsStarted[daemon.id] = requiredPromise.then(async () => {
        const { command } = daemon;

        const child = effects.runDaemon(command);
        let currentInput = {};
        const getCurrentInput = () => currentInput;
        const trigger = (daemon.ready.trigger ?? defaultTrigger)(
          getCurrentInput,
        );
        for (
          let res = await trigger.next();
          !res.done;
          res = await trigger.next()
        ) {
          const response = await daemon.ready.fn();
          if (response.status === "passing") {
            return child;
          }
        }
        return child;
      });
    }
    return {
      async term() {
        await Promise.all(
          Object.values<Promise<DaemonReturned>>(daemonsStarted).map((x) =>
            x.then((x) => x.term()),
          ),
        );
      },
      async wait() {
        await Promise.all(
          Object.values<Promise<DaemonReturned>>(daemonsStarted).map((x) =>
            x.then((x) => x.wait()),
          ),
        );
      },
    };
  }
}
