export * as configTypes from "./types/config-types.js";
import { ConfigSpec } from "./types/config-types.js";

// deno-lint-ignore no-namespace
export namespace ExpectedExports {
  version:
  2;
  /** Set configuration is called after we have modified and saved the configuration in the embassy ui. Use this to make a file for the docker to read from for configuration.  */
  export type setConfig = (
    effects: Effects,
    input: ConfigSpec,
  ) => Promise<ResultType<SetResult>>;
  /** Get configuration returns a shape that describes the format that the embassy ui will generate, and later send to the set config  */
  export type getConfig = (effects: Effects) => Promise<ResultType<ConfigRes>>;
  /** These are how we make sure the our dependency configurations are valid and if not how to fix them. */
  export type dependencies = Dependencies;
  /** For backing up service data though the embassyOS UI */
  export type createBackup = (effects: Effects) => Promise<ResultType<unknown>>;
  /** For restoring service data that was previously backed up using the embassyOS UI create backup flow. Backup restores are also triggered via the embassyOS UI, or doing a system restore flow during setup. */
  export type restoreBackup = (
    effects: Effects,
  ) => Promise<ResultType<unknown>>;
  /**  Properties are used to get values from the docker, like a username + password, what ports we are hosting from */
  export type properties = (
    effects: Effects,
  ) => Promise<ResultType<Properties>>;

  /** Health checks are used to determine if the service is working properly after starting
   * A good use case is if we are using a web server, seeing if we can get to the web server.
   */
  export type health = {
    /** Should be the health check id */
    [id: string]: (
      effects: Effects,
      dateMs: number,
    ) => Promise<ResultType<unknown>>;
  };

  /**
   * Migrations are used when we are changing versions when updating/ downgrading.
   * There are times that we need to move files around, and do other operations during a migration.
   */
  export type migration = (
    effects: Effects,
    version: string,
    ...args: unknown[]
  ) => Promise<ResultType<MigrationRes>>;

  /**
   * Actions are used so we can effect the service, like deleting a directory.
   * One old use case is to add a action where we add a file, that will then be run during the
   * service starting, and that file would indicate that it would rescan all the data.
   */
  export type action = {
    [id: string]: (
      effects: Effects,
      config?: ConfigSpec,
    ) => Promise<ResultType<ActionResult>>;
  };

  /**
   * This is the entrypoint for the main container. Used to start up something like the service that the
   * package represents, like running a bitcoind in a bitcoind-wrapper.
   */
  export type main = (effects: Effects) => Promise<ResultType<unknown>>;
}

export type ConfigRes = {
  /** This should be the previous config, that way during set config we start with the previous */
  config?: ConfigSpec;
  /** Shape that is describing the form in the ui */
  spec: ConfigSpec;
};
/** Used to reach out from the pure js runtime */
export type Effects = {
  /** Usable when not sandboxed */
  writeFile(
    input: { path: string; volumeId: string; toWrite: string },
  ): Promise<void>;
  readFile(input: { volumeId: string; path: string }): Promise<string>;
  metadata(input: { volumeId: string; path: string }): Promise<Metadata>;
  /** Create a directory. Usable when not sandboxed */
  createDir(input: { volumeId: string; path: string }): Promise<string>;

  readDir(input: { volumeId: string; path: string }): Promise<string[]>;
  /** Remove a directory. Usable when not sandboxed */
  removeDir(input: { volumeId: string; path: string }): Promise<string>;
  removeFile(input: { volumeId: string; path: string }): Promise<void>;

  /** Write a json file into an object. Usable when not sandboxed */
  writeJsonFile(
    input: { volumeId: string; path: string; toWrite: Record<string, unknown> },
  ): Promise<void>;

  /** Read a json file into an object */
  readJsonFile(
    input: { volumeId: string; path: string },
  ): Promise<Record<string, unknown>>;

  runCommand(
    input: { command: string; args?: string[]; timeoutMillis?: number },
  ): Promise<ResultType<string>>;
  runDaemon(input: { command: string; args?: string[] }): {
    wait(): Promise<ResultType<string>>;
    term(): Promise<void>;
  };

  chown(input: { volumeId: string; path: string; uid: string }): Promise<null>;
  chmod(input: { volumeId: string; path: string; mode: string }): Promise<null>;

  sleep(timeMs: number): Promise<null>;

  /** Log at the trace level */
  trace(whatToPrint: string): void;
  /** Log at the warn level */
  warn(whatToPrint: string): void;
  /** Log at the error level */
  error(whatToPrint: string): void;
  /** Log at the debug level */
  debug(whatToPrint: string): void;
  /** Log at the info level */
  info(whatToPrint: string): void;

  /** Sandbox mode lets us read but not write */
  is_sandboxed(): boolean;

  exists(input: { volumeId: string; path: string }): Promise<boolean>;
  bindLocal(
    options: { internalPort: number; name: string; externalPort: number },
  ): Promise<string>;
  bindTor(
    options: { internalPort: number; name: string; externalPort: number },
  ): Promise<string>;

  fetch(
    url: string,
    options?: {
      method?: "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "PATCH";
      headers?: Record<string, string>;
      body?: string;
    },
  ): Promise<{
    method: string;
    ok: boolean;
    status: number;
    headers: Record<string, string>;
    body?: string | null;
    /// Returns the body as a string
    text(): Promise<string>;
    /// Returns the body as a json
    json(): Promise<unknown>;
  }>;

  runRsync(options: {
    srcVolume: string;
    dstVolume: string;
    srcPath: string;
    dstPath: string;
    // rsync options: https://linux.die.net/man/1/rsync
    options: BackupOptions;
  }): {
    id: () => Promise<string>;
    wait: () => Promise<null>;
    progress: () => Promise<number>;
  };
};

// rsync options: https://linux.die.net/man/1/rsync
export type BackupOptions = {
  delete: boolean;
  force: boolean;
  ignoreExisting: boolean;
  exclude: string[];
};
export type Metadata = {
  fileType: string;
  isDir: boolean;
  isFile: boolean;
  isSymlink: boolean;
  len: number;
  modified?: Date;
  accessed?: Date;
  created?: Date;
  readonly: boolean;
  uid: number;
  gid: number;
  mode: number;
};

export type MigrationRes = {
  configured: boolean;
};

export type ActionResult = {
  version: "0";
  message: string;
  value?: string;
  copyable: boolean;
  qr: boolean;
};
export type SetResult = {
  /** These are the unix process signals */
  signal:
    | "SIGTERM"
    | "SIGHUP"
    | "SIGINT"
    | "SIGQUIT"
    | "SIGILL"
    | "SIGTRAP"
    | "SIGABRT"
    | "SIGBUS"
    | "SIGFPE"
    | "SIGKILL"
    | "SIGUSR1"
    | "SIGSEGV"
    | "SIGUSR2"
    | "SIGPIPE"
    | "SIGALRM"
    | "SIGSTKFLT"
    | "SIGCHLD"
    | "SIGCONT"
    | "SIGSTOP"
    | "SIGTSTP"
    | "SIGTTIN"
    | "SIGTTOU"
    | "SIGURG"
    | "SIGXCPU"
    | "SIGXFSZ"
    | "SIGVTALRM"
    | "SIGPROF"
    | "SIGWINCH"
    | "SIGIO"
    | "SIGPWR"
    | "SIGSYS"
    | "SIGEMT"
    | "SIGINFO";
  "depends-on": DependsOn;
};

export type DependsOn = {
  [packageId: string]: string[];
};

export type KnownError =
  | { error: string }
  | {
    "error-code": [number, string] | readonly [number, string];
  };
export type ResultType<T> = KnownError | { result: T };

export type PackagePropertiesV2 = {
  [name: string]: PackagePropertyObject | PackagePropertyString;
};
export type PackagePropertyString = {
  type: "string";
  description?: string;
  value: string;
  /** Let's the ui make this copyable button */
  copyable?: boolean;
  /** Let the ui create a qr for this field */
  qr?: boolean;
  /** Hiding the value unless toggled off for field */
  masked?: boolean;
};
export type PackagePropertyObject = {
  value: PackagePropertiesV2;
  type: "object";
  description: string;
};

export type Properties = {
  version: 2;
  data: PackagePropertiesV2;
};

export type Dependencies = {
  /** Id is the id of the package, should be the same as the manifest */
  [id: string]: {
    /** Checks are called to make sure that our dependency is in the correct shape. If a known error is returned we know that the dependency needs modification */
    check(
      effects: Effects,
      input: ConfigSpec,
    ): Promise<ResultType<void | null>>;
    /** This is called after we know that the dependency package needs a new configuration, this would be a transform for defaults */
    autoConfigure(
      effects: Effects,
      input: ConfigSpec,
    ): Promise<ResultType<ConfigSpec>>;
  };
};
