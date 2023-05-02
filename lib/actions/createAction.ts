import { Config } from "../config/builder"
import { ActionMetaData, ActionResult, Effects, ExportedAction } from "../types"
import { Utils, utils } from "../util"

export class CreatedAction<WrapperData, Type extends Record<string, any>> {
  private constructor(
    public readonly myMetaData: Omit<ActionMetaData, "input"> & {
      input: Config<Type, WrapperData, never>
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
    Input extends Config<Type, WrapperData, never>,
    Type extends Record<string, any> = (Input extends Config<any, infer B, any>
      ? B
      : never) &
      Record<string, any>,
  >(
    metaData: Omit<ActionMetaData, "input"> & {
      input: Config<Type, WrapperData, never>
    },
    fn: (options: {
      effects: Effects
      utils: Utils<WrapperData>
      input: Type
    }) => Promise<ActionResult>,
  ) {
    return new CreatedAction<WrapperData, Type>(metaData, fn)
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
        config: null,
      }),
    }
    await effects.exportAction(metaData)
  }
}

export const createAction = CreatedAction.of
