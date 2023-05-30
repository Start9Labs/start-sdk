import { Effects, ExpectedExports } from "../types"
import { Utils, utils } from "../util/utils"

export type UninstallFn<Store> = (opts: {
  effects: Effects
  utils: Utils<Store>
}) => Promise<void>
export class Uninstall<Store> {
  private constructor(readonly fn: UninstallFn<Store>) {}
  static of<Store>(fn: UninstallFn<Store>) {
    return new Uninstall(fn)
  }

  async uninit({
    effects,
    nextVersion,
  }: Parameters<ExpectedExports.uninit>[0]) {
    if (!nextVersion)
      await this.fn({
        effects,
        utils: utils(effects),
      })
  }
}

export function setupUninstall<Store>(fn: UninstallFn<Store>) {
  return Uninstall.of(fn)
}
