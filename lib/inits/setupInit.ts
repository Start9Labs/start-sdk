import { ExpectedExports } from "../types"
import { Migrations } from "./migrations/setupMigrations"
import { Install } from "./setupInstall"
import { Uninstall } from "./setupUninstall"

export function setupInit<Store, Vault>(
  migrations: Migrations<Store, Vault>,
  install: Install<Store, Vault>,
  uninstall: Uninstall<Store, Vault>,
): {
  init: ExpectedExports.init
  uninit: ExpectedExports.uninit
} {
  return {
    init: async (opts) => {
      await migrations.init(opts)
      await install.init(opts)
    },
    uninit: async (opts) => {
      await migrations.uninit(opts)
      await uninstall.uninit(opts)
    },
  }
}
