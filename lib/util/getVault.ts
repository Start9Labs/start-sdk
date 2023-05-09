import { Effects, EnsureStorePath } from "../types"

export class GetVault<Vault> {
  constructor(readonly effects: Effects, readonly key: keyof Vault & string) {}

  /**
   * Returns the value of Store at the provided path. Restart the service if the value changes
   */
  const() {
    return this.effects.vault.get({
      key: this.key,
      callback: this.effects.restart,
    })
  }
  /**
   * Returns the value of Store at the provided path. Does nothing if the value changes
   */
  once() {
    return this.effects.vault.get({
      key: this.key,
      callback: () => {},
    })
  }

  /**
   * Watches the value of Store at the provided path. Takes a custom callback function to run whenever the value changes
   */
  async *watch() {
    while (true) {
      let callback: () => void
      const waitForNext = new Promise<void>((resolve) => {
        callback = resolve
      })
      yield await this.effects.vault.get({
        key: this.key,
        callback: () => callback(),
      })
      await waitForNext
    }
  }
}
export function getVault<Vault>(effects: Effects, key: keyof Vault & string) {
  return new GetVault<Vault>(effects, key)
}
