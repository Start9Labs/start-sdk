import { SetInterfaces } from "../interfaces/setupInterfaces"
import { ExpectedExports } from "../types"
import { createUtils } from "../util"
import { Migrations } from "./migrations/setupMigrations"
import { SetupExports } from "./setupExports"
import { Install } from "./setupInstall"
import { Uninstall } from "./setupUninstall"

export function setupInit<Store>(
  migrations: Migrations<Store>,
  install: Install<Store>,
  uninstall: Uninstall<Store>,
  setInterfaces: SetInterfaces<Store, any, any>,
  setupExports: SetupExports<Store>,
): {
  init: ExpectedExports.init
  uninit: ExpectedExports.uninit
} {
  return {
    init: async (opts) => {
      const utils = createUtils<Store>(opts.effects)
      await migrations.init(opts)
      await install.init(opts)
      await setInterfaces({
        ...opts,
        input: null,
        utils,
      })
      const { services, ui } = await setupExports({
        ...opts,
        utils,
      })
      await opts.effects.exposeForDependents(services)
      await opts.effects.exposeUi(ui)
    },
    uninit: async (opts) => {
      await migrations.uninit(opts)
      await uninstall.uninit(opts)
    },
  }
}
