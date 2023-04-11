import { HealthReceipt, ReadyProof } from "../health";
import { CheckResult } from "../health/checkFns";
import { Trigger } from "../health/trigger";
import { Effects, ValidIfNoStupidEscape } from "../types";
import { InterfaceReceipt } from "./interfaceReceipt";
type Daemon<
  Ids extends string | never,
  Command extends string,
  Id extends string
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
};

const todo = <A>(): A => {
  throw new Error("TODO");
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
    readonly daemons?: Daemon<Ids, "command", any>[]
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
    newDaemon: Daemon<Ids, Command, Id>
  ) {
    const daemons = [...(this?.daemons ?? [])];
    daemons.push(newDaemon as any);
    return new Daemons<Ids | Id>(this.effects, this.started, daemons);
  }

  build() {
    return todo<any>();
  }
}
