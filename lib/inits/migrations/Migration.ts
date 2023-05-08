import { ManifestVersion } from "../../manifest/ManifestTypes"
import { Effects } from "../../types"
import { Utils } from "../../util"
import { WrapperDataContract } from "../../wrapperData/wrapperDataContract"

export class Migration<WD, Version extends ManifestVersion> {
  constructor(
    readonly wrapperDataContract: WrapperDataContract<WD>,
    readonly options: {
      version: Version
      up: (opts: { effects: Effects; utils: Utils<WD> }) => Promise<void>
      down: (opts: { effects: Effects; utils: Utils<WD> }) => Promise<void>
    },
  ) {}
  static of<WD, Version extends ManifestVersion>(
    wrapperDataContract: WrapperDataContract<WD>,
    options: {
      version: Version
      up: (opts: { effects: Effects; utils: Utils<WD> }) => Promise<void>
      down: (opts: { effects: Effects; utils: Utils<WD> }) => Promise<void>
    },
  ) {
    return new Migration(wrapperDataContract, options)
  }

  async up(opts: { effects: Effects; utils: Utils<WD> }) {
    this.up(opts)
  }

  async down(opts: { effects: Effects; utils: Utils<WD> }) {
    this.down(opts)
  }
}
