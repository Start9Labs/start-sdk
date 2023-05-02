import { ValueSpec } from "../configTypes"
import { Utils } from "../../util"
import { Value } from "./value"
import { _ } from "../../util"
import { Effects } from "../../types"
import { Parser, object } from "ts-matches"

export type LazyBuildOptions<WD, ConfigType> = {
  effects: Effects
  utils: Utils<WD>
  config: ConfigType | null
}
export type LazyBuild<WD, ConfigType, ExpectedOut> = (
  options: LazyBuildOptions<WD, ConfigType>,
) => Promise<ExpectedOut> | ExpectedOut

// prettier-ignore
export type ExtractConfigType<A extends Record<string, any> | Config<Record<string, any>, any, any>> = 
  A extends Config<infer B, any, any> ? B :
  A

export type MaybeLazyValues<A> = LazyBuild<any, any, A> | A
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
export class Config<Type extends Record<string, any>, WD, ConfigType> {
  private constructor(
    private readonly spec: {
      [K in keyof Type]: Value<Type[K], WD, ConfigType>
    },
    public validator: Parser<unknown, Type>,
  ) {}
  async build(options: LazyBuildOptions<WD, ConfigType>) {
    const answer = {} as {
      [K in keyof Type]: ValueSpec
    }
    for (const k in this.spec) {
      answer[k] = await this.spec[k].build(options)
    }
    return answer
  }

  static of<Type extends Record<string, any>, WrapperData, ConfigType>(spec: {
    [K in keyof Type]: Value<Type[K], WrapperData, ConfigType>
  }) {
    const validatorObj = {} as {
      [K in keyof Type]: Parser<unknown, Type[K]>
    }
    for (const key in spec) {
      validatorObj[key] = spec[key].validator
    }
    const validator = object(validatorObj)
    return new Config<Type, WrapperData, ConfigType>(spec, validator)
  }

  static withWrapperData<WrapperData>() {
    return {
      of<Type extends Record<string, any>>(spec: {
        [K in keyof Type]: Value<Type[K], WrapperData, Type>
      }) {
        return Config.of<Type, WrapperData, Type>(spec)
      },
    }
  }
}
