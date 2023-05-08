import { Config, ExtractConfigType } from "../config/builder/config"
import { ActionMetaData, ActionResult, Effects, ExportedAction } from "../types"
import { Utils, createUtils, utils } from "../util"

export class CreatedAction<
  Store,
  ConfigType extends
    | Record<string, any>
    | Config<any, Store>
    | Config<any, never>,
  Type extends Record<string, any> = ExtractConfigType<ConfigType>,
> {
  private constructor(
    public readonly myMetaData: ActionMetaData,
    readonly fn: (options: {
      effects: Effects
      utils: Utils<Store>
      input: Type
    }) => Promise<ActionResult>,
    readonly input: Config<Type, Store> | Config<Type, never>,
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
    metaData: Omit<ActionMetaData, "input"> & {
      input: Config<Type, Store> | Config<Type, never>
    },
    fn: (options: {
      effects: Effects
      utils: Utils<Store>
      input: Type
    }) => Promise<ActionResult>,
  ) {
    const { input, ...rest } = metaData
    return new CreatedAction<Store, ConfigType, Type>(rest, fn, input)
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

  async getConfig({ effects }: { effects: Effects }) {
    return this.input.build({
      effects,
      utils: createUtils(effects) as any,
    })
  }
}

export const createAction = CreatedAction.of
