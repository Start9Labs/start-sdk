import { Effects, ExpectedExports, ExportedAction } from "../types";
import { ActionMetaData } from "../types";
import { CreatedAction } from "./createAction";

export function setupActions(...createdActions: CreatedAction<any, any>[]) {
  const actions: Record<string, ExportedAction> = {};
  for (const action of createdActions) {
    actions[action.metaData.id] = action.exportedAction;
  }

  const initializeActions = async (effects: Effects) => {
    for (const action of createdActions) {
      action.exportAction(effects);
    }
  };
  return {
    actions,
    initializeActions,
  };
}
