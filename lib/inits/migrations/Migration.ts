import { ManifestVersion } from "../../manifest/ManifestTypes"
import { Effects } from "../../types"

export class Migration<Version extends ManifestVersion> {
  constructor(
    readonly options: {
      version: Version
      up: (opts: { effects: Effects }) => Promise<void>
      down: (opts: { effects: Effects }) => Promise<void>
    },
  ) {}
  static of<Version extends ManifestVersion>(options: {
    version: Version
    up: (opts: { effects: Effects }) => Promise<void>
    down: (opts: { effects: Effects }) => Promise<void>
  }) {
    return new Migration(options)
  }

  async up(opts: { effects: Effects }) {
    this.up(opts)
  }

  async down(opts: { effects: Effects }) {
    this.down(opts)
  }
}
