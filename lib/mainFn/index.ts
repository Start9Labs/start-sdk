import { Effects, ExpectedExports } from "../types";
import { Utils, utils } from "../util";
import { Daemons } from "./Daemons";
export * as network from "./exportInterfaces";
export { LocalBinding } from "./LocalBinding";
export { LocalPort } from "./LocalPort";
export { NetworkBuilder } from "./NetworkBuilder";
export { NetworkInterfaceBuilder } from "./NetworkInterfaceBuilder";
export { Origin } from "./Origin";
export { TorBinding } from "./TorBinding";
export { TorHostname } from "./TorHostname";

export { Daemons } from "./Daemons";

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
export const setupMain = <WrapperData>(
  fn: (o: {
    effects: Effects;
    started(onTerm: () => void): null;
    utils: Utils<WrapperData>;
  }) => Promise<Daemons<any>>,
): ExpectedExports.main => {
  return async (options) => {
    const result = await fn({
      ...options,
      utils: utils<WrapperData>(options.effects),
    });
    await result.build().then((x) => x.wait());
  };
};
