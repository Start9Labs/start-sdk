import { Effects, ExpectedExports } from "../types"
import { Utils, utils } from "../util"

export type InstallFn<WrapperData> = (opts: {
  effects: Effects
  utils: Utils<WrapperData>
}) => Promise<void>
export class Install<WrapperData> {
  private constructor(readonly fn: InstallFn<WrapperData>) {}
  static of<WrapperData>(fn: InstallFn<WrapperData>) {
    return new Install(fn)
  }

  async init({
    effects,
    previousVersion,
  }: Parameters<ExpectedExports.init>[0]) {
    if (!previousVersion) await this.fn({ effects, utils: utils(effects) })
  }
}

export function setupInstall<WrapperData>(fn: InstallFn<WrapperData>) {
  return Install.of(fn)
}
