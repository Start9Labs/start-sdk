import { RunningMainRet } from "./RunningMainRet";
import { Effects, ExpectedExports } from "../types";
export * as network from "./exportInterfaces";
export { LocalBinding } from "./LocalBinding";
export { LocalPort } from "./LocalPort";
export { NetworkBuilder } from "./NetworkBuilder";
export { NetworkInterfaceBuilder } from "./NetworkInterfaceBuilder";
export { Origin } from "./Origin";
export { TorBinding } from "./TorBinding";
export { TorHostname } from "./TorHostname";

export const runningMain: (
  fn: (o: {
    effects: Effects;
    started(onTerm: () => void): null;
  }) => Promise<RunningMainRet>
) => ExpectedExports.main = (fn) => {
  return async (options) => {
    const { daemon } = await fn(options);
    daemon.wait();
  };
};
