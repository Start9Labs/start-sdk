import { Effects, ExpectedExports } from "../types"
import { SDKManifest } from "../manifest/ManifestTypes"
import * as D from "./dependencies"
import { Config, ExtractConfigType } from "./builder/config"
import { Utils, utils } from "../util"
import nullIfEmpty from "../util/nullIfEmpty"

declare const dependencyProof: unique symbol
export type DependenciesReceipt = void & {
  [dependencyProof]: never
}

export type Save<
  WD,
  A extends
    | Record<string, any>
    | Config<Record<string, any>, any>
    | Config<Record<string, never>, never>,
  Manifest extends SDKManifest,
> = (options: {
  effects: Effects
  input: ExtractConfigType<A> & Record<string, any>
  utils: Utils<WD>
  dependencies: D.Dependencies<Manifest>
}) => Promise<{
  dependenciesReceipt: DependenciesReceipt
  restart: boolean
}>
export type Read<
  WD,
  A extends
    | Record<string, any>
    | Config<Record<string, any>, any>
    | Config<Record<string, any>, never>,
> = (options: {
  effects: Effects
  utils: Utils<WD>
}) => Promise<void | (ExtractConfigType<A> & Record<string, any>)>
/**
 * We want to setup a config export with a get and set, this
 * is going to be the default helper to setup config, because it will help
 * enforce that we have a spec, write, and reading.
 * @param options
 * @returns
 */
export function setupConfig<
  WD,
  ConfigType extends
    | Record<string, any>
    | Config<any, any>
    | Config<any, never>,
  Manifest extends SDKManifest,
  Type extends Record<string, any> = ExtractConfigType<ConfigType>,
>(
  spec: Config<Type, WD> | Config<Type, never>,
  write: Save<WD, Type, Manifest>,
  read: Read<WD, Type>,
) {
  const validator = spec.validator
  return {
    setConfig: (async ({ effects, input }) => {
      if (!validator.test(input)) {
        await console.error(String(validator.errorMessage(input)))
        return { error: "Set config type error for config" }
      }
      const { restart } = await write({
        input: JSON.parse(JSON.stringify(input)),
        effects,
        utils: utils<WD>(effects),
        dependencies: D.dependenciesSet<Manifest>(),
      })
      if (restart) {
        await effects.restart()
      }
    }) as ExpectedExports.setConfig,
    getConfig: (async ({ effects }) => {
      const myUtils = utils<WD>(effects)
      const configValue = nullIfEmpty(
        (await read({ effects, utils: myUtils })) || null,
      )
      return {
        spec: await spec.build({
          effects,
          utils: myUtils as any,
        }),
        config: configValue,
      }
    }) as ExpectedExports.getConfig,
  }
}

export default setupConfig
