import { Effects } from "../types"

export class GetSystemSmtp {
  constructor(readonly effects: Effects) {}

  /** This should be used as the primary method in main since it allows the main to
   * restart if the wrapper data changes
   */
  const() {
    return this.effects.getSystemSmtp({
      callback: this.effects.restart,
    })
  }
  /**
   * Returns the wrapper data once and then never again
   * Doesn't restart the server when the wrapper data changes
   */
  once() {
    return this.effects.getSystemSmtp({
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
      yield await this.effects.getSystemSmtp({
        callback: () => callback(),
      })
      await waitForNext
    }
  }
}
