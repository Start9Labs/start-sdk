import { Origin } from "./Origin";

export class TorBinding {
  constructor(readonly host: string) {}
  createOrigin(protocol: string) {
    return new Origin(protocol, this.host);
  }
}
