import { ManifestVersion } from "../../manifest/ManifestTypes"
import { Effects } from "../../types"
import { Utils } from "../../util/utils"

export class Migration<Store, Vault, Version extends ManifestVersion> {
  constructor(
    readonly options: {
      version: Version
      up: (opts: {
        effects: Effects
        utils: Utils<Store, Vault>
      }) => Promise<void>
      down: (opts: {
        effects: Effects
        utils: Utils<Store, Vault>
      }) => Promise<void>
    },
  ) {}
  static of<Store, Vault, Version extends ManifestVersion>(options: {
    version: Version
    up: (opts: {
      effects: Effects
      utils: Utils<Store, Vault>
    }) => Promise<void>
    down: (opts: {
      effects: Effects
      utils: Utils<Store, Vault>
    }) => Promise<void>
  }) {
    return new Migration<Store, Vault, Version>(options)
  }

  async up(opts: { effects: Effects; utils: Utils<Store, Vault> }) {
    this.up(opts)
  }

  async down(opts: { effects: Effects; utils: Utils<Store, Vault> }) {
    this.down(opts)
  }
}
