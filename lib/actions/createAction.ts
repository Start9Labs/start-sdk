import { Parser } from "ts-matches";
import { Config } from "../config/builder";
import {
  ActionMetaData,
  ActionResult,
  Effects,
  ExportedAction,
} from "../types";
import { Utils, once, utils } from "../util";
import { TypeFromProps } from "../util/propertiesMatcher";
import { InputSpec } from "../config/configTypes";

export class CreatedAction<WrapperData, Input extends Config<InputSpec>> {
  private constructor(
    private myMetaData: Omit<ActionMetaData, "input"> & { input: Input },
    readonly fn: (options: {
      effects: Effects;
      utils: Utils<WrapperData>;
      input: TypeFromProps<Input>;
    }) => Promise<ActionResult>,
  ) {}
  private validator = this.myMetaData.input.validator() as Parser<
    unknown,
    TypeFromProps<Input>
  >;
  metaData = {
    ...this.myMetaData,
    input: this.myMetaData.input.build(),
  };

  static of<WrapperData, Input extends Config<InputSpec>>(
    metaData: Omit<ActionMetaData, "input"> & { input: Input },
    fn: (options: {
      effects: Effects;
      utils: Utils<WrapperData>;
      input: TypeFromProps<Input>;
    }) => Promise<ActionResult>,
  ) {
    return new CreatedAction<WrapperData, Input>(metaData, fn);
  }

  exportedAction: ExportedAction = ({ effects, input }) => {
    return this.fn({
      effects,
      utils: utils<WrapperData>(effects),
      input: this.validator.unsafeCast(input),
    });
  };

  async exportAction(effects: Effects) {
    await effects.exportAction(this.metaData);
  }
}

export const createAction = CreatedAction.of;
