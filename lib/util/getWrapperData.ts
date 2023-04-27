import { Parser } from "ts-matches";
import { Effects, EnsureWrapperDataPath, ExtractWrapperData } from "../types";
import { NoAny } from ".";

export class WrapperData<WrapperData, Path extends string> {
  constructor(
    readonly effects: Effects,
    readonly path: Path & EnsureWrapperDataPath<WrapperData, Path>,
    readonly options: {
      /** Defaults to what ever the package currently in */
      packageId?: string | undefined;
    } = {},
  ) {}

  const() {
    return this.effects.getWrapperData<WrapperData, Path>({
      ...this.options,
      path: this.path as any,
      callback: this.effects.restart,
    });
  }
  once() {
    return this.effects.getWrapperData<WrapperData, Path>({
      ...this.options,
      path: this.path as any,
      callback: () => {},
    });
  }
  async *watch() {
    while (true) {
      let callback: () => void;
      const waitForNext = new Promise<void>((resolve) => {
        callback = resolve;
      });
      yield await this.effects.getWrapperData<WrapperData, Path>({
        ...this.options,
        path: this.path as any,
        callback: () => callback(),
      });
      await waitForNext;
    }
  }
}
export function getWrapperData<WrapperData, Path extends string>(
  effects: Effects,
  path: Path & EnsureWrapperDataPath<WrapperData, Path>,
  options: {
    /** Defaults to what ever the package currently in */
    packageId?: string | undefined;
  } = {},
) {
  return new WrapperData<WrapperData, Path>(effects, path as any, options);
}
