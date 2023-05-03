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
    public readonly myMetaData: ActionMetaData,
    readonly fn: (options: {
      effects: Effects
      utils: Utils<WrapperData>
      input: Type
    }) => Promise<ActionResult>,
    readonly input: Config<Type, WrapperData> | Config<Type, never>,
  ) {}
  public validator = this.input.validator

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
    const { input, ...rest } = metaData
    return new CreatedAction<WrapperData, ConfigType, Type>(rest, fn, input)
  }

  exportedAction: ExportedAction = ({ effects, input }) => {
    return this.fn({
      effects,
      utils: utils<WrapperData>(effects),
      input: this.validator.unsafeCast(input),
    })
  }

  run = async ({ effects, input }: { effects: Effects; input?: Type }) => {
    return this.fn({
      effects,
      utils: utils<WrapperData>(effects),
      input: this.validator.unsafeCast(input),
    })
  }

  async getConfig({ effects }: { effects: Effects }) {
    return this.input.build({
      effects,
      utils: utils<WrapperData>(effects) as any,
    })
  }
}

export const createAction = CreatedAction.of
