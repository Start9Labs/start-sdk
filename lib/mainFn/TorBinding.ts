import { Origin } from "./Origin"

export class TorBinding {
  constructor(readonly host: string) {}
  createOrigin(protocol: string | null) {
    return new Origin(protocol, this.host)
  }
}
