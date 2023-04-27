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

  /** This should be used as the primary method in main since it allows the main to
   * restart if the wrapper data changes
   */
  const() {
    return this.effects.getWrapperData<WrapperData, Path>({
      ...this.options,
      path: this.path as any,
      callback: this.effects.restart,
    })
  }
  /**
   * Returns the wrapper data once and then never again
   * Doesn't restart the server when the wrapper data changes
   */
  once() {
    return this.effects.getWrapperData<WrapperData, Path>({
      ...this.options,
      path: this.path as any,
      callback: () => {},
    })
  }
  /**
   * Keeps giving the latest wrapper data as it changes
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
