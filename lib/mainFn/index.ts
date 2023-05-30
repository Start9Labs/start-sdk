import { Effects, ExpectedExports } from "../types"
import { createMainUtils } from "../util"
import { Utils, utils } from "../util/utils"
import { Daemons } from "./Daemons"
import "../interfaces/NetworkInterfaceBuilder"
import "../interfaces/Origin"

import "./Daemons"

/**
 * Used to ensure that the main function is running with the valid proofs.
 * We first do the folowing order of things
 * 1. We get the interfaces
 * 2. We setup all the commands to setup the system
 * 3. We create the health checks
 * 4. We setup the daemons init system
 * @param fn
 * @returns
 */
export const setupMain = <Store>(
  fn: (o: {
    effects: Effects
    started(onTerm: () => void): null
    utils: Utils<Store, {}>
  }) => Promise<Daemons<any>>,
): ExpectedExports.main => {
  return async (options) => {
    const result = await fn({
      ...options,
      utils: createMainUtils<Store>(options.effects),
    })
    await result.build().then((x) => x.wait())
  }
}
