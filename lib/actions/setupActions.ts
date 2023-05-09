import { Effects, ExpectedExports } from "../types"
import { createUtils } from "../util"
import { once } from "../util/once"
import { CreatedAction } from "./createAction"

export function setupActions<Store, Vault>(
  ...createdActions: CreatedAction<Store, Vault, any>[]
) {
  const myActions = once(() => {
    const actions: Record<string, CreatedAction<Store, Vault, any>> = {}
    for (const action of createdActions) {
      actions[action.myMetaData.id] = action
    }
    return actions
  })
  return {
    get actions() {
      return myActions()
    },
    async actionsMetaData({ effects }: { effects: Effects }) {
      const utils = createUtils<Store, Vault>(effects)
      return Promise.all(
        createdActions.map((x) => x.actionMetaData({ effects, utils })),
      )
    },
  } satisfies {
    actions: ExpectedExports.actions
    actionsMetaData: ExpectedExports.actionsMetaData
  }
}
