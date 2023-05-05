import { Effects, ExpectedExports } from "../types"
import { Utils, utils } from "../util"

export type InstallFn<WD> = (opts: {
  effects: Effects
  utils: Utils<WD>
}) => Promise<void>
export class Install<WD> {
  private constructor(readonly fn: InstallFn<WD>) {}
  static of<WD>(fn: InstallFn<WD>) {
    return new Install(fn)
  }

  async init({
    effects,
    previousVersion,
  }: Parameters<ExpectedExports.init<WD>>[0]) {
    if (!previousVersion) await this.fn({ effects, utils: utils(effects) })
  }
}

export function setupInstall<WD>(fn: InstallFn<WD>) {
  return Install.of(fn)
}
