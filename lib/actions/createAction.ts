import { Config, ExtractConfigType } from "../config/builder/config"
import { ActionMetaData, ActionResult, Effects, ExportedAction } from "../types"
import { createUtils } from "../util"
import { Utils, utils } from "../util/utils"

export class CreatedAction<
  Store,
  Vault,
  ConfigType extends
    | Record<string, any>
    | Config<any, Store, Vault>
    | Config<any, never, never>,
  Type extends Record<string, any> = ExtractConfigType<ConfigType>,
> {
  private constructor(
    public readonly myMetaData: Omit<ActionMetaData, "input">,
    readonly fn: (options: {
      effects: Effects
      utils: Utils<Store, Vault>
      input: Type
    }) => Promise<ActionResult>,
    readonly input: Config<Type, Store, Vault>,
  ) {}
  public validator = this.input.validator

  static of<
    Store,
    Vault,
    ConfigType extends
      | Record<string, any>
      | Config<any, any, any>
      | Config<any, never, never>,
    Type extends Record<string, any> = ExtractConfigType<ConfigType>,
  >(
    metaData: Omit<ActionMetaData, "input"> & {
      input: Config<Type, Store, Vault> | Config<Type, never, never>
    },
    fn: (options: {
      effects: Effects
      utils: Utils<Store, Vault>
      input: Type
    }) => Promise<ActionResult>,
  ) {
    const { input, ...rest } = metaData
    return new CreatedAction<Store, Vault, ConfigType, Type>(
      rest,
      fn,
      input as Config<Type, Store, Vault>,
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

  async actionMetaData(options: {
    effects: Effects
    utils: Utils<Store, Vault>
  }): Promise<ActionMetaData> {
    return {
      ...this.myMetaData,
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
