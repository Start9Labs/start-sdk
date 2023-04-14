export class Origin {
  constructor(readonly protocol: string, readonly host: string) {}

  withAuth(
    origin?:
      | {
          password: string;
          username: string;
        }
      | null
      | undefined
  ) {
    // prettier-ignore
    const urlAuth = !!(origin) ? `${origin.username}:${origin.password}@` :
            '';
    return `${this.protocol}://${urlAuth}${this.host}`;
  }
}
