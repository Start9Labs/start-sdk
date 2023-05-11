import { SetInterfaces } from "../interfaces/setupInterfaces"
import { ExpectedExports } from "../types"
import { createUtils } from "../util"
import { Migrations } from "./migrations/setupMigrations"
import { Install } from "./setupInstall"
import { Uninstall } from "./setupUninstall"

export function setupInit<Store, Vault>(
  migrations: Migrations<Store, Vault>,
  install: Install<Store, Vault>,
  uninstall: Uninstall<Store, Vault>,
  setInterfaces: SetInterfaces<Store, Vault, any, any>,
): {
  init: ExpectedExports.init
  uninit: ExpectedExports.uninit
} {
  return {
    init: async (opts) => {
      await migrations.init(opts)
      await install.init(opts)
      await setInterfaces({
        ...opts,
        input: null,
        utils: createUtils<Store, Vault>(opts.effects),
      })
    },
    uninit: async (opts) => {
      await migrations.uninit(opts)
      await uninstall.uninit(opts)
    },
  }
}
