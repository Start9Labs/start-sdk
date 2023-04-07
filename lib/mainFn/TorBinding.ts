import { Origin } from "./Origin";

export class TorBinding {
  constructor(readonly address: string) {}
  createOrigin(protocol: string) {
    return new Origin(protocol, this.address);
  }
}
