import { Config, ExtractConfigType } from "../config/builder/config"
import { ActionMetaData, ActionResult, Effects, ExportedAction } from "../types"
import { Utils, createUtils, utils } from "../util"
import { WrapperDataContract } from "../wrapperData/wrapperDataContract"

export class CreatedAction<
  WD,
  ConfigType extends Record<string, any> | Config<any, WD> | Config<any, never>,
  Type extends Record<string, any> = ExtractConfigType<ConfigType>,
> {
  private constructor(
    readonly wrapperDataContract: WrapperDataContract<WD>,
    public readonly myMetaData: ActionMetaData,
    readonly fn: (options: {
      effects: Effects
      utils: Utils<WD>
      input: Type
    }) => Promise<ActionResult>,
    readonly input: Config<Type, WD> | Config<Type, never>,
  ) {}
  public validator = this.input.validator

  static of<
    WD,
    ConfigType extends
      | Record<string, any>
      | Config<any, any>
      | Config<any, never>,
    Type extends Record<string, any> = ExtractConfigType<ConfigType>,
  >(
    wrapperDataContract: WrapperDataContract<WD>,
    metaData: Omit<ActionMetaData, "input"> & {
      input: Config<Type, WD> | Config<Type, never>
    },
    fn: (options: {
      effects: Effects
      utils: Utils<WD>
      input: Type
    }) => Promise<ActionResult>,
  ) {
    const { input, ...rest } = metaData
    return new CreatedAction<WD, ConfigType, Type>(
      wrapperDataContract,
      rest,
      fn,
      input,
    )
  }

  exportedAction: ExportedAction = ({ effects, input }) => {
    return this.fn({
      effects,
      utils: createUtils(this.wrapperDataContract, effects),
      input: this.validator.unsafeCast(input),
    })
  }

  run = async ({ effects, input }: { effects: Effects; input?: Type }) => {
    return this.fn({
      effects,
      utils: createUtils(this.wrapperDataContract, effects),
      input: this.validator.unsafeCast(input),
    })
  }

  async getConfig({ effects }: { effects: Effects }) {
    return this.input.build({
      effects,
      utils: createUtils(this.wrapperDataContract, effects) as any,
    })
  }
}

export const createAction = CreatedAction.of
