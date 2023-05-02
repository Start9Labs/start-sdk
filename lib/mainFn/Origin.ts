export class Origin {
  constructor(readonly protocol: string | null, readonly host: string) {}

  withAuth(
    origin?:
      | {
          password: null | string
          username: string
        }
      | null
      | undefined,
  ) {
    // prettier-ignore
    const urlAuth = !!(origin) ? `${origin.username}${origin.password != null ?`:${origin.password}`:''}@` :
            '';
    const protocolSection = this.protocol != null ? `${this.protocol}://` : ""
    return `${protocolSection}${urlAuth}${this.host}`
  }
}
