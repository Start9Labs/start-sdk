import { Effects, ExpectedExports } from "../types";
import { Utils, utils } from "../util";

export type UninstallFn<WrapperData> = (opts: {
  effects: Effects;
  utils: Utils<WrapperData>;
}) => Promise<void>;
export class Uninstall<WrapperData> {
  private constructor(readonly fn: UninstallFn<WrapperData>) {}
  static of<WrapperData>(fn: UninstallFn<WrapperData>) {
    return new Uninstall(fn);
  }

  async uninit({
    effects,
    nextVersion,
  }: Parameters<ExpectedExports.uninit>[0]) {
    if (!nextVersion) await this.fn({ effects, utils: utils(effects) });
  }
}

export function setupUninstall<WrapperData>(fn: UninstallFn<WrapperData>) {
  return Uninstall.of(fn);
}
