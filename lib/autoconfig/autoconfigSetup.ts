import { ExpectedExports, PackageId } from "../types";
import { AutoConfig } from "./AutoConfig";

export function autoconfigSetup<Config>(
  autoconfigs: Record<PackageId, AutoConfig<Config>>
) {
  const autoconfig: ExpectedExports.autoConfig<Config> = {};

  for (const [id, autoconfigValue] of Object.entries(autoconfigs)) {
    autoconfig[id] = autoconfigValue.build();
  }

  return autoconfig;
}
