import { Config, ExtractConfigType } from "../config/builder/config"
import { ActionMetadata, ActionResult, Effects, ExportedAction } from "../types"
import { createUtils } from "../util"
import { Utils } from "../util/utils"

export type MaybeFn<Store, Value> =
  | Value
  | ((options: {
      effects: Effects
      utils: Utils<Store>
    }) => Promise<Value> | Value)
export class CreatedAction<
  Store,
  ConfigType extends
    | Record<string, any>
    | Config<any, Store>
    | Config<any, never>,
  Type extends Record<string, any> = ExtractConfigType<ConfigType>,
> {
  private constructor(
    public readonly myMetaData: MaybeFn<Store, Omit<ActionMetadata, "input">>,
    readonly fn: (options: {
      effects: Effects
      utils: Utils<Store>
      input: Type
    }) => Promise<ActionResult>,
    readonly input: Config<Type, Store>,
  ) {}
  public validator = this.input.validator

  static of<
    Store,
    ConfigType extends
      | Record<string, any>
      | Config<any, any>
      | Config<any, never>,
    Type extends Record<string, any> = ExtractConfigType<ConfigType>,
  >(
    metaData: MaybeFn<Store, Omit<ActionMetadata, "input">>,
    fn: (options: {
      effects: Effects
      utils: Utils<Store>
      input: Type
    }) => Promise<ActionResult>,
    inputConfig: Config<Type, Store> | Config<Type, never>,
  ) {
    return new CreatedAction<Store, ConfigType, Type>(
      metaData,
      fn,
      inputConfig as Config<Type, Store>,
    )
  }

  exportedAction: ExportedAction = ({ effects, input }) => {
    return this.fn({
      effects,
      utils: createUtils(effects),
      input: this.validator.unsafeCast(input),
    })
  }

  run = async ({ effects, input }: { effects: Effects; input?: Type }) => {
    return this.fn({
      effects,
      utils: createUtils(effects),
      input: this.validator.unsafeCast(input),
    })
  }

  async metaData(options: { effects: Effects; utils: Utils<Store> }) {
    if (this.myMetaData instanceof Function)
      return await this.myMetaData(options)
    return this.myMetaData
  }

  async ActionMetadata(options: {
    effects: Effects
    utils: Utils<Store>
  }): Promise<ActionMetadata> {
    return {
      ...(await this.metaData(options)),
      input: await this.input.build(options),
    }
  }

  async getConfig({ effects }: { effects: Effects }) {
    return this.input.build({
      effects,
      utils: createUtils(effects) as any,
    })
  }
}

export const createAction = CreatedAction.of
