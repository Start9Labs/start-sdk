import { getConfig, setConfig } from "./mod.ts";
import * as T from "../types.ts";
import * as M from "../migrations.ts";
import * as util from "../util.ts";
import { EmVer } from "../emver-lite/mod.ts";
import { ConfigSpec } from "../types/config-types.ts";
import { Config } from "../config_builder/mod.ts";

export interface NoRepeat<version extends string, type extends "up" | "down"> {
  version: version;
  type: type;
}

/**
 * @param fn function making desired modifications to the config
 * @param configured whether or not the service should be considered "configured"
 * @param noRepeat (optional) supply the version and type of the migration
 * @param noFail (optional, default:false) whether or not to fail the migration if fn throws an error
 * @returns a migraion function
 */
export function updateConfig<
  version extends string,
  type extends "up" | "down",
>(
  fn: (
    config: ConfigSpec,
    effects: T.Effects,
  ) => ConfigSpec | Promise<ConfigSpec>,
  configured: boolean,
  noRepeat?: NoRepeat<version, type>,
  noFail = false,
): M.MigrationFn<version, type> {
  return M.migrationFn(async (effects: T.Effects) => {
    await noRepeatGuard(effects, noRepeat, async () => {
      let config =
        util.unwrapResultType(await getConfig(Config.of({}))(effects)).config;
      if (config) {
        try {
          config = await fn(config, effects);
        } catch (e) {
          if (!noFail) {
            throw e;
          } else {
            configured = false;
          }
        }
        util.unwrapResultType(await setConfig(effects, config));
      }
    });
    return { configured };
  });
}

export async function noRepeatGuard<
  version extends string,
  type extends "up" | "down",
>(
  effects: T.Effects,
  noRepeat: NoRepeat<version, type> | undefined,
  fn: () => Promise<void>,
): Promise<void> {
  if (!noRepeat) {
    return fn();
  }
  if (
    !(await util.exists(effects, {
      path: "start9/migrations",
      volumeId: "main",
    }))
  ) {
    await effects.createDir({ path: "start9/migrations", volumeId: "main" });
  }
  const migrationPath = {
    path: `start9/migrations/${noRepeat.version}.complete`,
    volumeId: "main",
  };
  if (noRepeat.type === "up") {
    if (!(await util.exists(effects, migrationPath))) {
      await fn();
      await effects.writeFile({ ...migrationPath, toWrite: "" });
    }
  } else if (noRepeat.type === "down") {
    if (await util.exists(effects, migrationPath)) {
      await fn();
      await effects.removeFile(migrationPath);
    }
  }
}

export async function initNoRepeat<versions extends string>(
  effects: T.Effects,
  migrations: M.MigrationMapping<versions>,
  startingVersion: string,
) {
  if (
    !(await util.exists(effects, {
      path: "start9/migrations",
      volumeId: "main",
    }))
  ) {
    const starting = EmVer.parse(startingVersion);
    await effects.createDir({ path: "start9/migrations", volumeId: "main" });
    for (const version in migrations) {
      const migrationVersion = EmVer.parse(version);
      if (migrationVersion.lessThanOrEqual(starting)) {
        await effects.writeFile({
          path: `start9/migrations/${version}.complete`,
          volumeId: "main",
          toWrite: "",
        });
      }
    }
  }
}

export function fromMapping<versions extends string>(
  migrations: M.MigrationMapping<versions>,
  currentVersion: string,
): T.ExpectedExports.migration {
  const inner = M.fromMapping(migrations, currentVersion);
  return async (effects: T.Effects, version: string, direction?: unknown) => {
    await initNoRepeat(
      effects,
      migrations,
      direction === "from" ? version : currentVersion,
    );
    return inner(effects, version, direction);
  };
}
