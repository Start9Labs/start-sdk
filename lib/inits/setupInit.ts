import { ExpectedExports } from "../types"
import { Migrations } from "./migrations/setupMigrations"
import { Install } from "./setupInstall"
import { Uninstall } from "./setupUninstall"

export function setupInit<Store>(
  migrations: Migrations<Store>,
  install: Install<Store>,
  uninstall: Uninstall<Store>,
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
