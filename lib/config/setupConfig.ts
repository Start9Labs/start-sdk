import { Config } from "./builder"
import { DeepPartial, Dependencies, Effects, ExpectedExports } from "../types"
import { InputSpec } from "./configTypes"
import { Utils, nullIfEmpty, once, utils } from "../util"
import { GenericManifest } from "../manifest/ManifestTypes"
import * as D from "./dependencies"

declare const dependencyProof: unique symbol
export type DependenciesReceipt = void & {
  [dependencyProof]: never
}

export type Save<WD, A, Manifest extends GenericManifest> = (options: {
  effects: Effects
  input: A
  utils: Utils<WD>
  dependencies: D.Dependencies<Manifest>
}) => Promise<DependenciesReceipt>
export type Read<WD, A> = (options: {
  effects: Effects
  utils: Utils<WD>
}) => Promise<void | A>
/**
 * We want to setup a config export with a get and set, this
 * is going to be the default helper to setup config, because it will help
 * enforce that we have a spec, write, and reading.
 * @param options
 * @returns
 */
export function setupConfig<
  WD,
  Type extends Record<string, any>,
  Manifest extends GenericManifest,
>(
  spec: Config<Type, WD, Type>,
  write: Save<WD, Type, Manifest>,
  read: Read<WD, Type>,
) {
  const validator = spec.validator
  return {
    setConfig: (async ({ effects, input }) => {
      if (!validator.test(input)) {
        await effects.console.error(String(validator.errorMessage(input)))
        return { error: "Set config type error for config" }
      }
      await write({
        input: JSON.parse(JSON.stringify(input)),
        effects,
        utils: utils<WD>(effects),
        dependencies: D.dependenciesSet<Manifest>(),
      })
    }) as ExpectedExports.setConfig,
    getConfig: (async ({ effects }) => {
      const myUtils = utils<WD>(effects)
      const configValue = nullIfEmpty(
        (await read({ effects, utils: myUtils })) || null,
      )
      return {
        spec: await spec.build({
          effects,
          utils: myUtils,
          config: configValue,
        }),
        config: configValue,
      }
    }) as ExpectedExports.getConfig,
  }
}

export default setupConfig
