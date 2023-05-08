import { Effects, ExpectedExports } from "../types"
import { createMainUtils, Utils, utils } from "../util"
import { Daemons } from "./Daemons"
import "./exportInterfaces"
import "./LocalBinding"
import "./LocalPort"
import "./NetworkBuilder"
import "./NetworkInterfaceBuilder"
import "./Origin"
import "./TorBinding"
import "./TorHostname"

import "./Daemons"
import { WrapperDataContract } from "../wrapperData/wrapperDataContract"

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
export const setupMain = <WD>(
  wrapperDataContract: WrapperDataContract<WD>,
  fn: (o: {
    effects: Effects
    started(onTerm: () => void): null
    utils: Utils<WD, {}>
  }) => Promise<Daemons<any>>,
): ExpectedExports.main => {
  return async (options) => {
    const result = await fn({
      ...options,
      utils: createMainUtils(wrapperDataContract, options.effects),
    })
    await result.build().then((x) => x.wait())
  }
}
