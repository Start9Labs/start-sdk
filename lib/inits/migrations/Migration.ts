import { ManifestVersion } from "../../manifest/ManifestTypes"
import { Effects } from "../../types"
import { Utils } from "../../util/utils"

export class Migration<Store, Version extends ManifestVersion> {
  constructor(
    readonly options: {
      version: Version
      up: (opts: { effects: Effects; utils: Utils<Store> }) => Promise<void>
      down: (opts: { effects: Effects; utils: Utils<Store> }) => Promise<void>
    },
  ) {}
  static of<Store, Version extends ManifestVersion>(options: {
    version: Version
    up: (opts: { effects: Effects; utils: Utils<Store> }) => Promise<void>
    down: (opts: { effects: Effects; utils: Utils<Store> }) => Promise<void>
  }) {
    return new Migration(options)
  }

  async up(opts: { effects: Effects; utils: Utils<Store> }) {
    this.up(opts)
  }

  async down(opts: { effects: Effects; utils: Utils<Store> }) {
    this.down(opts)
  }
}
