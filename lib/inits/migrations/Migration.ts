import { ManifestVersion } from "../../manifest/ManifestTypes"
import { Effects } from "../../types"
import { Utils } from "../../util/utils"

export class Migration<Stor, Version extends ManifestVersion> {
  constructor(
    readonly options: {
      version: Version
      up: (opts: { effects: Effects; utils: Utils<Stor> }) => Promise<void>
      down: (opts: { effects: Effects; utils: Utils<Stor> }) => Promise<void>
    },
  ) {}
  static of<Stor, Version extends ManifestVersion>(options: {
    version: Version
    up: (opts: { effects: Effects; utils: Utils<Stor> }) => Promise<void>
    down: (opts: { effects: Effects; utils: Utils<Stor> }) => Promise<void>
  }) {
    return new Migration<Stor, Version>(options)
  }

  async up(opts: { effects: Effects; utils: Utils<Stor> }) {
    this.up(opts)
  }

  async down(opts: { effects: Effects; utils: Utils<Stor> }) {
    this.down(opts)
  }
}
