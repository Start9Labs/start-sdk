import { Parser } from "ts-matches"
import { Effects, EnsureWrapperDataPath, ExtractWrapperData } from "../types"
import { NoAny } from "."

export class GetWrapperData<WrapperData, Path extends string> {
  constructor(
    readonly effects: Effects,
    readonly path: Path & EnsureWrapperDataPath<WrapperData, Path>,
    readonly options: {
      /** Defaults to what ever the package currently in */
      packageId?: string | undefined
    } = {},
  ) {}

  /**
   * Returns the value of WrapperData at the provided path. Restart the service if the value changes
   */
  const() {
    return this.effects.getWrapperData<WrapperData, Path>({
      ...this.options,
      path: this.path as any,
      callback: this.effects.restart,
    })
  }
  /**
   * Returns the value of WrapperData at the provided path. Does nothing if the value changes
   */
  once() {
    return this.effects.getWrapperData<WrapperData, Path>({
      ...this.options,
      path: this.path as any,
      callback: () => {},
    })
  }

  /**
   * Watches the value of WrapperData at the provided path. Takes a custom callback function to run whenever the value changes
   */
  async *watch() {
    while (true) {
      let callback: () => void
      const waitForNext = new Promise<void>((resolve) => {
        callback = resolve
      })
      yield await this.effects.getWrapperData<WrapperData, Path>({
        ...this.options,
        path: this.path as any,
        callback: () => callback(),
      })
      await waitForNext
    }
  }
}
export function getWrapperData<WrapperData, Path extends string>(
  effects: Effects,
  path: Path & EnsureWrapperDataPath<WrapperData, Path>,
  options: {
    /** Defaults to what ever the package currently in */
    packageId?: string | undefined
  } = {},
) {
  return new GetWrapperData<WrapperData, Path>(effects, path as any, options)
}
