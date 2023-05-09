import { Effects, ExpectedExports } from "../types"
import { createUtils } from "../util"
import { once } from "../util/once"
import { CreatedAction } from "./createAction"

export function setupActions<Store>(
  ...createdActions: CreatedAction<any, any>[]
) {
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
    async actionMetaData({ effects }: { effects: Effects }) {
      const utils = createUtils<Store>(effects)
      return Promise.all(
        createdActions.map((x) => x.actionMetaData({ effects, utils })),
      )
    },
  } satisfies {
    actions: ExpectedExports.actions
    actionMetaData: ExpectedExports.actionMetaData
  }
}
