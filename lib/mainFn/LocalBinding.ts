import { once } from "../util/once"
import { Origin } from "./Origin"

/**
 * Pulled from https://www.oreilly.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
 * to test ipv4 addresses
 */
export const regexToTestIp4 = once(() => /(?:[0-9]{1,3}\.){3}[0-9]{1,3}/)
/**
 * Pulled from https://ihateregex.io/expr/ipv6/
 * to test ipv6 addresses
 */
export const ipv6 = once(
  () =>
    /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/,
)
/**
 * Some addresses are local
 */
export const local = once(() => /\.local/)
export class LocalBinding {
  constructor(readonly localHost: string, readonly ipHosts: string[]) {}
  createOrigins(protocol: string | null) {
    const ipHosts = this.ipHosts
    return {
      local: new Origin(protocol, this.localHost),
      get all() {
        return [this.local, ...this.ip]
      },
      get ip() {
        return ipHosts
          .filter((x) => !local().test(x))
          .map((x) => new Origin(protocol, x))
      },
      get ipv4() {
        return ipHosts
          .filter(regexToTestIp4().test)
          .map((x) => new Origin(protocol, x))
      },
      get ipv6() {
        return ipHosts.filter(ipv6().test).map((x) => new Origin(protocol, x))
      },
    }
  }
}
