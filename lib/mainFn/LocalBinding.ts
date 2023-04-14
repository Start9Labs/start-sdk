import { Origin } from "./Origin";

export class LocalBinding {
  constructor(readonly localHost: string, readonly ipHost: string) {}
  createOrigins(protocol: string) {
    return {
      local: new Origin(protocol, this.localHost),
      ip: new Origin(protocol, this.ipHost),
    };
  }
}
