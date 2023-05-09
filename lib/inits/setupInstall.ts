import { Effects, ExpectedExports } from "../types"
import { Utils, utils } from "../util/utils"

export type InstallFn<Store, Vault> = (opts: {
  effects: Effects
  utils: Utils<Store, Vault>
}) => Promise<void>
export class Install<Store, Vault> {
  private constructor(readonly fn: InstallFn<Store, Vault>) {}
  static of<Store, Vault>(fn: InstallFn<Store, Vault>) {
    return new Install(fn)
  }

  async init({
    effects,
    previousVersion,
  }: Parameters<ExpectedExports.init>[0]) {
    if (!previousVersion)
      await this.fn({
        effects,
        utils: utils(effects),
      })
  }
}

export function setupInstall<Store, Vault>(fn: InstallFn<Store, Vault>) {
  return Install.of(fn)
}
