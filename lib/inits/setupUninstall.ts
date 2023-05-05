import { Effects, ExpectedExports } from "../types"
import { Utils, utils } from "../util"

export type UninstallFn<WD> = (opts: {
  effects: Effects
  utils: Utils<WD>
}) => Promise<void>
export class Uninstall<WD> {
  private constructor(readonly fn: UninstallFn<WD>) {}
  static of<WD>(fn: UninstallFn<WD>) {
    return new Uninstall(fn)
  }

  async uninit({
    effects,
    nextVersion,
  }: Parameters<ExpectedExports.uninit<WD>>[0]) {
    if (!nextVersion) await this.fn({ effects, utils: utils(effects) })
  }
}

export function setupUninstall<WD>(fn: UninstallFn<WD>) {
  return Uninstall.of(fn)
}
