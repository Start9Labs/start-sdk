import { ExpectedExports } from "../types"
import { Migrations } from "./migrations/setupMigrations"
import { Install } from "./setupInstall"
import { Uninstall } from "./setupUninstall"

export function setupInit<WD>(
  migrations: Migrations<WD>,
  install: Install<WD>,
  uninstall: Uninstall<WD>,
): {
  init: ExpectedExports.init<WD>
  uninit: ExpectedExports.uninit<WD>
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
