import { Effects, ExpectedExports } from "../types"
import { Utils, utils } from "../util/utils"

export type InstallFn<Store> = (opts: {
  effects: Effects
  utils: Utils<Store>
}) => Promise<void>
export class Install<Store> {
  private constructor(readonly fn: InstallFn<Store>) {}
  static of<Store>(fn: InstallFn<Store>) {
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

export function setupInstall<Store>(fn: InstallFn<Store>) {
  return Install.of(fn)
}
