import { Config, ExtractConfigType } from "../config/builder/config"
import { ActionMetaData, ActionResult, Effects, ExportedAction } from "../types"
import { Utils, utils } from "../util"

export class CreatedAction<
  WrapperData,
  ConfigType extends
    | Record<string, any>
    | Config<any, WrapperData>
    | Config<any, never>,
  Type extends Record<string, any> = ExtractConfigType<ConfigType>,
> {
  private constructor(
    public readonly myMetaData: Omit<ActionMetaData, "input"> & {
      input: Config<Type, WrapperData>
    },
    readonly fn: (options: {
      effects: Effects
      utils: Utils<WrapperData>
      input: Type
    }) => Promise<ActionResult>,
  ) {}
  private validator = this.myMetaData.input.validator

  static of<
    WrapperData,
    ConfigType extends Record<string, any> | Config<any, any>,
    Type extends Record<string, any> = ExtractConfigType<ConfigType>,
  >(
    metaData: Omit<ActionMetaData, "input"> & {
      input: Config<Type, WrapperData>
    },
    fn: (options: {
      effects: Effects
      utils: Utils<WrapperData>
      input: Type
    }) => Promise<ActionResult>,
  ) {
    return new CreatedAction<WrapperData, ConfigType, Type>(metaData, fn)
  }

  exportedAction: ExportedAction = ({ effects, input }) => {
    return this.fn({
      effects,
      utils: utils<WrapperData>(effects),
      input: this.validator.unsafeCast(input),
    })
  }

  async exportAction(effects: Effects) {
    const myUtils = utils<WrapperData>(effects)
    const metaData = {
      ...this.myMetaData,
      input: await this.myMetaData.input.build({
        effects,
        utils: myUtils,
      }),
    }
    await effects.exportAction(metaData)
  }
}

export const createAction = CreatedAction.of
