import { Effects, ExpectedExports } from "../types"
import { Utils, utils } from "../util"
import { WrapperDataContract } from "../wrapperData/wrapperDataContract"

export type InstallFn<WD> = (opts: {
  effects: Effects
  utils: Utils<WD>
}) => Promise<void>
export class Install<WD> {
  private constructor(
    readonly wrapperDataContract: WrapperDataContract<WD>,
    readonly fn: InstallFn<WD>,
  ) {}
  static of<WD>(
    wrapperDataContract: WrapperDataContract<WD>,
    fn: InstallFn<WD>,
  ) {
    return new Install(wrapperDataContract, fn)
  }

  async init({
    effects,
    previousVersion,
  }: Parameters<ExpectedExports.init>[0]) {
    if (!previousVersion)
      await this.fn({
        effects,
        utils: utils(this.wrapperDataContract, effects),
      })
  }
}

export function setupInstall<WD>(
  wrapperDataContract: WrapperDataContract<WD>,
  fn: InstallFn<WD>,
) {
  return Install.of(wrapperDataContract, fn)
}
