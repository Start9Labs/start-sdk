import { Effects, ExpectedExports, ExportedAction } from "../types"
import { ActionMetaData } from "../types"
import { CreatedAction } from "./createAction"

export function setupActions(...createdActions: CreatedAction<any, any>[]) {
  return {
    get actions() {
      const actions: Record<string, ExportedAction> = {}
      for (const action of createdActions) {
        actions[action.myMetaData.id] = action.exportedAction
      }
      return actions
    },
    get actionsMetadata() {
      return createdActions.map((x) => x.myMetaData)
    },
  }
}
