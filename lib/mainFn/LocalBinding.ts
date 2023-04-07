import { Origin } from "./Origin";

export class LocalBinding {
  constructor(readonly localAddress: string, readonly ipAddress: string) {}
  createOrigins(protocol: string) {
    return {
      local: new Origin(protocol, this.localAddress),
      ip: new Origin(protocol, this.ipAddress),
    };
  }
}
