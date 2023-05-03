import { Effects, ExpectedExports, ExportedAction } from "../types"
import { ActionMetaData } from "../types"
import { once } from "../util/once"
import { CreatedAction } from "./createAction"

export function setupActions(...createdActions: CreatedAction<any, any>[]) {
  const myActions = once(() => {
    const actions: Record<string, CreatedAction<any, any>> = {}
    for (const action of createdActions) {
      actions[action.myMetaData.id] = action
    }
    return actions
  })
  return {
    get actions() {
      return myActions()
    },
    get actionsMetadata() {
      return createdActions.map((x) => x.myMetaData)
    },
  }
}
