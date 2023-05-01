export class Origin {
  constructor(readonly protocol: string, readonly host: string) {}

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
    return `${this.protocol}://${urlAuth}${this.host}`
  }
}
