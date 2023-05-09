import { Effects, ExpectedExports } from "../types"
import { Utils, utils } from "../util/utils"

export type UninstallFn<Store, Vault> = (opts: {
  effects: Effects
  utils: Utils<Store, Vault>
}) => Promise<void>
export class Uninstall<Store, Vault> {
  private constructor(readonly fn: UninstallFn<Store, Vault>) {}
  static of<Store, Vault>(fn: UninstallFn<Store, Vault>) {
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

export function setupUninstall<Store, Vault>(fn: UninstallFn<Store, Vault>) {
  return Uninstall.of(fn)
}
