import { ManifestVersion } from "../../manifest/ManifestTypes"
import { Effects } from "../../types"
import { Utils } from "../../util"

export class Migration<Version extends ManifestVersion, WD> {
  constructor(
    readonly options: {
      version: Version
      up: (opts: { effects: Effects; utils: Utils<WD> }) => Promise<void>
      down: (opts: { effects: Effects; utils: Utils<WD> }) => Promise<void>
    },
  ) {}
  static of<Version extends ManifestVersion>(options: {
    version: Version
    up: (opts: { effects: Effects }) => Promise<void>
    down: (opts: { effects: Effects }) => Promise<void>
  }) {
    return new Migration(options)
  }

  async up(opts: { effects: Effects; utils: Utils<WD> }) {
    this.up(opts)
  }

  async down(opts: { effects: Effects; utils: Utils<WD> }) {
    this.down(opts)
  }
}
