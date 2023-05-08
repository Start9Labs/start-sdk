import { Effects, ExpectedExports } from "../types"
import { Utils, utils } from "../util"
import { WrapperDataContract } from "../wrapperData/wrapperDataContract"

export type UninstallFn<WrapperData> = (opts: {
  effects: Effects
  utils: Utils<WrapperData>
}) => Promise<void>
export class Uninstall<WD> {
  private constructor(
    readonly wrapperDataContract: WrapperDataContract<WD>,
    readonly fn: UninstallFn<WD>,
  ) {}
  static of<WD>(
    wrapperDataContract: WrapperDataContract<WD>,
    fn: UninstallFn<WD>,
  ) {
    return new Uninstall(wrapperDataContract, fn)
  }

  async uninit({
    effects,
    nextVersion,
  }: Parameters<ExpectedExports.uninit>[0]) {
    if (!nextVersion)
      await this.fn({
        effects,
        utils: utils(this.wrapperDataContract, effects),
      })
  }
}

export function setupUninstall<WD>(
  wrapperDataContract: WrapperDataContract<WD>,
  fn: UninstallFn<WD>,
) {
  return Uninstall.of(wrapperDataContract, fn)
}
