export class Origin {
  constructor(readonly protocol: string | null, readonly host: string) {}

  build({ basic, path, search }: BuildOptions) {
    // prettier-ignore
    const urlAuth = !!(basic) ? `${basic.username}@` :
            '';
    const protocolSection = this.protocol != null ? `${this.protocol}://` : ""

    const qpEntries = Object.entries(search)
      .map(
        ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`,
      )
      .join("&")

    const qp = qpEntries.length ? `?${qpEntries}` : ""

    return `${protocolSection}${urlAuth}${this.host}${path}${qp}`
  }
}

type BuildOptions = {
  basic: { username: string } | null
  path: string
  search: Record<string, string>
}
