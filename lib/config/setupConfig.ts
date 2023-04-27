import { Config } from "./builder"
import { DeepPartial, Dependencies, Effects, ExpectedExports } from "../types"
import { InputSpec } from "./configTypes"
import { Utils, nullIfEmpty, once, utils } from "../util"
import { TypeFromProps } from "../util/propertiesMatcher"
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
}) => Promise<void | DeepPartial<A>>
/**
 * We want to setup a config export with a get and set, this
 * is going to be the default helper to setup config, because it will help
 * enforce that we have a spec, write, and reading.
 * @param options
 * @returns
 */
export function setupConfig<
  WD,
  A extends Config<InputSpec>,
  Manifest extends GenericManifest,
>(
  spec: A,
  write: Save<WD, TypeFromProps<A>, Manifest>,
  read: Read<WD, TypeFromProps<A>>,
) {
  const validator = once(() => spec.validator())
  return {
    setConfig: (async ({ effects, input }) => {
      if (!validator().test(input)) {
        await effects.console.error(String(validator().errorMessage(input)))
        return { error: "Set config type error for config" }
      }
      await write({
        input: JSON.parse(JSON.stringify(input)),
        effects,
        utils: utils<WD>(effects),
        dependencies: D.dependenciesSet<Manifest>(),
      })
    }) as ExpectedExports.setConfig,
    getConfig: (async ({ effects, config }) => {
      return {
        spec: spec.build(),
        config: nullIfEmpty(
          (await read({ effects, utils: utils<WD>(effects) })) || null,
        ),
      }
    }) as ExpectedExports.getConfig,
  }
}

export default setupConfig
