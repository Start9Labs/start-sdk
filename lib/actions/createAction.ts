import {
  ActionMetaData,
  ActionResult,
  Effects,
  ExportedAction,
} from "../types";
import { Utils, utils } from "../util";

export class CreatedAction<WrapperData, Input> {
  private constructor(
    readonly metaData: ActionMetaData,
    readonly fn: (options: {
      effects: Effects;
      utils: Utils<WrapperData>;
      input: Input;
    }) => Promise<ActionResult>,
  ) {}

  static of<WrapperData, Input>(
    metaData: ActionMetaData,
    fn: (options: {
      effects: Effects;
      utils: Utils<WrapperData>;
      input: Input;
    }) => Promise<ActionResult>,
  ) {
    return new CreatedAction<WrapperData, Input>(metaData, fn);
  }

  exportedAction: ExportedAction = ({ effects, input }) => {
    return this.fn({
      effects,
      utils: utils<WrapperData>(effects),
      input: input as Input,
    });
  };

  async exportAction(effects: Effects) {
    await effects.exportAction(this.metaData);
  }
}

export const createAction = CreatedAction.of;
