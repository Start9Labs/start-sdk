import { ExpectedExports } from "../types";
import { Migrations } from "./migrations/setupMigrations";
import { Install } from "./setupInstall";
import { Uninstall } from "./setupUninstall";

export function setupInit<WrapperData>(
  migrations: Migrations,
  install: Install<WrapperData>,
  uninstall: Uninstall<WrapperData>,
): {
  init: ExpectedExports.init;
  uninit: ExpectedExports.uninit;
} {
  return {
    init: async (opts) => {
      await migrations.init(opts);
      await install.init(opts);
    },
    uninit: async (opts) => {
      await migrations.uninit(opts);
      await uninstall.uninit(opts);
    },
  };
}
