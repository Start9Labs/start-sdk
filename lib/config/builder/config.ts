import { InputSpec, ValueSpec } from "../configTypes";
import { typeFromProps } from "../../util";
import { BuilderExtract, IBuilder } from "./builder";
import { Value } from "./value";

/**
 * Configs are the specs that are used by the os configuration form for this service.
 * Here is an example of a simple configuration
  ```ts
    const smallConfig = Config.of({
      test: Value.boolean({
        name: "Test",
        description: "This is the description for the test",
        warning: null,
        default: false,
      }),
    });
  ```

  The idea of a config is that now the form is going to ask for
  Test: [ ] and the value is going to be checked as a boolean.
  There are more complex values like selects, lists, and objects. See {@link Value}

  Also, there is the ability to get a validator/parser from this config spec.
  ```ts
  const matchSmallConfig = smallConfig.validator();
  type SmallConfig = typeof matchSmallConfig._TYPE;
  ```

  Here is an example of a more complex configuration which came from a configuration for a service
  that works with bitcoin, like c-lightning.
  ```ts

    export const hostname = Value.string({
  name: "Hostname",
  default: null,
  description: "Domain or IP address of bitcoin peer",
  warning: null,
  required: true,
  masked: false,
  placeholder: null,
  pattern:
    "(^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$)|((^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$)|(^[a-z2-7]{16}\\.onion$)|(^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$))",
  patternDescription:
    "Must be either a domain name, or an IPv4 or IPv6 address. Do not include protocol scheme (eg 'http://') or port.",
});
export const port = Value.number({
  name: "Port",
  default: null,
  description: "Port that peer is listening on for inbound p2p connections",
  warning: null,
  required: false,
  range: "[0,65535]",
  integral: true,
  units: null,
  placeholder: null,
});
export const addNodesSpec = Config.of({ hostname: hostname, port: port });

  ```
 */
export class Config<A extends InputSpec> extends IBuilder<A> {
  static empty() {
    return new Config({});
  }
  static withValue<K extends string, B extends ValueSpec>(
    key: K,
    value: Value<B>,
  ) {
    return Config.empty().withValue(key, value);
  }
  static addValue<K extends string, B extends ValueSpec>(
    key: K,
    value: Value<B>,
  ) {
    return Config.empty().withValue(key, value);
  }

  static of<B extends { [key: string]: Value<ValueSpec> }>(spec: B) {
    const answer: { [K in keyof B]: BuilderExtract<B[K]> } = {} as any;
    for (const key in spec) {
      answer[key] = spec[key].build() as any;
    }
    return new Config(answer);
  }
  withValue<K extends string, B extends ValueSpec>(key: K, value: Value<B>) {
    return new Config({
      ...this.a,
      [key]: value.build(),
    } as A & { [key in K]: B });
  }
  addValue<K extends string, B extends ValueSpec>(key: K, value: Value<B>) {
    return new Config({
      ...this.a,
      [key]: value.build(),
    } as A & { [key in K]: B });
  }

  public validator() {
    return typeFromProps(this.a);
  }
}
