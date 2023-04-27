export * as configTypes from "./config/configTypes";
import { InputSpec } from "./config/configTypes";
import { DependenciesReceipt } from "./config/setupConfig";

export type ExportedAction = (options: {
  effects: Effects;
  input?: Record<string, unknown>;
}) => Promise<ActionResult>;

export namespace ExpectedExports {
  version: 1;
  /** Set configuration is called after we have modified and saved the configuration in the start9 ui. Use this to make a file for the docker to read from for configuration.  */
  export type setConfig = (options: {
    effects: Effects;
    input: Record<string, unknown>;
  }) => Promise<void>;
  /** Get configuration returns a shape that describes the format that the start9 ui will generate, and later send to the set config  */
  export type getConfig = (options: {
    effects: Effects;
    config: unknown;
  }) => Promise<ConfigRes>;
  // /** These are how we make sure the our dependency configurations are valid and if not how to fix them. */
  // export type dependencies = Dependencies;
  /** For backing up service data though the startOS UI */
  export type createBackup = (options: {
    effects: Effects;
  }) => Promise<unknown>;
  /** For restoring service data that was previously backed up using the startOS UI create backup flow. Backup restores are also triggered via the startOS UI, or doing a system restore flow during setup. */
  export type restoreBackup = (options: {
    effects: Effects;
  }) => Promise<unknown>;
  /**  Properties are used to get values from the docker, like a username + password, what ports we are hosting from */
  export type properties = <WrapperData>(options: {
    wrapperData: WrapperData;
  }) => Promise<Properties | null | undefined | void>;

  // /** Health checks are used to determine if the service is working properly after starting
  //  * A good use case is if we are using a web server, seeing if we can get to the web server.
  //  */
  // export type health = {
  //   /** Should be the health check id */
  //   [id: string]: (options: { effects: Effects; input: TimeMs }) => Promise<unknown>;
  // };

  /**
   * Actions are used so we can effect the service, like deleting a directory.
   * One old use case is to add a action where we add a file, that will then be run during the
   * service starting, and that file would indicate that it would rescan all the data.
   */
  export type actions = {
    [id: string]: ExportedAction;
  };

  /**
   * This is the entrypoint for the main container. Used to start up something like the service that the
   * package represents, like running a bitcoind in a bitcoind-wrapper.
   */
  export type main = (options: {
    effects: Effects;
    started(onTerm: () => void): null;
  }) => Promise<unknown>;

  /**
   * After a shutdown, if we wanted to do any operations to clean up things, like
   * set the action as unavailable or something.
   */
  export type afterShutdown = (options: {
    effects: Effects;
  }) => Promise<unknown>;

  /**
   * Every time a package completes an install, this function is called before the main.
   * Can be used to do migration like things.
   */
  export type init = (options: {
    effects: Effects;
    previousVersion: null | string;
  }) => Promise<unknown>;
  /** This will be ran during any time a package is uninstalled, for example during a update
   * this will be called.
   */
  export type uninit = (options: {
    effects: Effects;
    nextVersion: null | string;
  }) => Promise<unknown>;

  /** Auto configure is used to make sure that other dependencies have the values t
   * that this service could use.
   */
  export type autoConfig = Record<PackageId, AutoConfigure>;
}
export type TimeMs = number;
export type VersionString = string;

/**
 * AutoConfigure is used as the value to the key of package id,
 * this is used to make sure that other dependencies have the values that this service could use.
 */
export type AutoConfigure = {
  /** Checks are called to make sure that our dependency is in the correct shape. If a known error is returned we know that the dependency needs modification */
  check(options: {
    effects: Effects;
    localConfig: unknown;
    remoteConfig: unknown;
  }): Promise<void>;
  /** This is called after we know that the dependency package needs a new configuration, this would be a transform for defaults */
  autoConfigure(options: {
    effects: Effects;
    localConfig: unknown;
    remoteConfig: unknown;
  }): Promise<unknown>;
};

export type ValidIfNoStupidEscape<A> = A extends
  | `${string}'"'"'${string}`
  | `${string}\\"${string}`
  ? never
  : "" extends A & ""
  ? never
  : A;

export type ConfigRes = {
  /** This should be the previous config, that way during set config we start with the previous */
  config?: null | Record<string, unknown>;
  /** Shape that is describing the form in the ui */
  spec: InputSpec;
};

declare const DaemonProof: unique symbol;
export type DaemonReceipt = {
  [DaemonProof]: never;
};
export type Daemon = {
  wait(): Promise<string>;
  term(): Promise<void>;
  [DaemonProof]: never;
};

export type HealthStatus = "passing" | "warning" | "failing" | "disabled";

export type CommandType<A extends string> =
  | ValidIfNoStupidEscape<A>
  | [string, ...string[]];

export type DaemonReturned = {
  wait(): Promise<string>;
  term(): Promise<void>;
};

export type ActionMetaData = {
  name: string;
  description: string;
  id: string;
  input: null | InputSpec;
  runningOnly: boolean;
  /**
   * So the ordering of the actions is by alphabetical order of the group, then followed by the alphabetical of the actions
   */
  group?: string;
};

/** Used to reach out from the pure js runtime */
export type Effects = {
  /** Usable when not sandboxed */
  writeFile(input: {
    path: string;
    volumeId: string;
    toWrite: string;
  }): Promise<void>;
  readFile(input: { volumeId: string; path: string }): Promise<string>;
  metadata(input: { volumeId: string; path: string }): Promise<Metadata>;
  /** Create a directory. Usable when not sandboxed */
  createDir(input: { volumeId: string; path: string }): Promise<string>;

  readDir(input: { volumeId: string; path: string }): Promise<string[]>;
  /** Remove a directory. Usable when not sandboxed */
  removeDir(input: { volumeId: string; path: string }): Promise<string>;
  removeFile(input: { volumeId: string; path: string }): Promise<void>;

  /** Write a json file into an object. Usable when not sandboxed */
  writeJsonFile(input: {
    volumeId: string;
    path: string;
    toWrite: Record<string, unknown>;
  }): Promise<void>;

  /** Read a json file into an object */
  readJsonFile(input: {
    volumeId: string;
    path: string;
  }): Promise<Record<string, unknown>>;

  runCommand<A extends string>(
    command: ValidIfNoStupidEscape<A> | [string, ...string[]],
    input?: {
      timeoutMillis?: number;
    },
  ): Promise<string>;
  runShellDaemon(command: string): {
    wait(): Promise<string>;
    term(): Promise<void>;
  };
  runDaemon<A extends string>(
    command: ValidIfNoStupidEscape<A> | [string, ...string[]],
  ): DaemonReturned;

  /** Uses the chown on the system */
  chown(input: { volumeId: string; path: string; uid: string }): Promise<null>;
  /** Uses the chmod on the system */
  chmod(input: { volumeId: string; path: string; mode: string }): Promise<null>;

  sleep(timeMs: TimeMs): Promise<null>;

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

  /** Check that a file exists or not */
  exists(input: { volumeId: string; path: string }): Promise<boolean>;
  /** Declaring that we are opening a interface on some protocal for local network
   * Returns the port exposed
   */
  bindLan(options: { internalPort: number; name: string }): Promise<number>;
  /** Declaring that we are opening a interface on some protocal for tor network */
  bindTor(options: {
    internalPort: number;
    name: string;
    externalPort: number;
  }): Promise<string>;

  /** Similar to the fetch api via the mdn, this is simplified but the point is
   * to get something from some website, and return the response.
   */
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

  /**
   * Run rsync between two volumes. This is used to backup data between volumes.
   * This is a long running process, and a structure that we can either wait for, or get the progress of.
   */
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

  /** Get a value in a json like data, can be observed and subscribed */
  getWrapperData<WrapperData = never, Path extends string = never>(options: {
    /** If there is no packageId it is assumed the current package */
    packageId?: string;
    /** The path defaults to root level, using the [JsonPath](https://jsonpath.com/) */
    path: Path & EnsureWrapperDataPath<WrapperData, Path>;
    callback: (config: unknown, previousConfig: unknown) => void;
  }): Promise<ExtractWrapperData<WrapperData, Path>>;

  /** Used to store values that can be accessed and subscribed to */
  setWrapperData<WrapperData = never, Path extends string = never>(options: {
    /** Sets the value for the wrapper at the path, it will override, using the [JsonPath](https://jsonpath.com/)  */
    path: Path & EnsureWrapperDataPath<WrapperData, Path>;
    value: ExtractWrapperData<WrapperData, Path>;
  }): Promise<void>;

  getLocalHostname(): Promise<string>;
  getIPHostname(): Promise<string>;
  /** Get the address for another service for tor interfaces */
  getServiceTorHostname(
    interfaceId: string,
    packageId?: string,
  ): Promise<string>;
  /**
   * Get the port address for another service
   */
  getServicePortForward(
    internalPort: number,
    packageId?: string,
  ): Promise<number>;

  /** When we want to create a link in the front end interfaces, and example is
   * exposing a url to view a web service
   */
  exportAddress(options: {
    /** The title of this field to be dsimplayed */
    name: string;
    /** Human readable description, used as tooltip usually */
    description: string;
    /** URI location */
    address: string;
    id: string;
    /** Defaults to false, but describes if this address can be opened in a browser as an
     * ui interface
     */
    ui?: boolean;

    /**
     * The id is that a path will create a link in the ui that can go to specific pages, like
     * admin, or settings, or something like that.
     * Default = ''
     */
    path?: string;

    /**
     * This is the query params in the url, and is a map of key value pairs
     * Default = {}
     * if empty then will not be added to the url
     */
    search?: Record<string, string>;
  }): Promise<string>;

  /**
   *Remove an address that was exported. Used problably during main or during setConfig.
   * @param options
   */
  removeAddress(options: { id: string }): Promise<void>;

  /**
   *
   * @param options
   */
  exportAction(options: ActionMetaData): Promise<void>;
  /**
   * Remove an action that was exported. Used problably during main or during setConfig.
   */
  removeAction(options: { id: string }): Promise<void>;

  getConfigured(): Promise<boolean>;
  /**
   * This called after a valid set config as well as during init.
   * @param configured
   */
  setConfigured(configured: boolean): Promise<void>;

  /**
   *
   * @returns  PEM encoded fullchain (ecdsa)
   */
  getSslCertificate: (
    packageId: string,
    algorithm?: "ecdsa" | "ed25519",
  ) => [string, string, string];
  /**
   * @returns PEM encoded ssl key (ecdsa)
   */
  getSslKey: (packageId: string, algorithm?: "ecdsa" | "ed25519") => string;

  setHealth(o: {
    name: string;
    status: HealthStatus;
    message?: string;
  }): Promise<void>;

  /** Set the dependencies of what the service needs, usually ran during the set config as a best practice */
  setDependencies(dependencies: Dependencies): Promise<DependenciesReceipt>;
  /** Exists could be useful during the runtime to know if some service exists, option dep */
  exists(packageId: PackageId): Promise<boolean>;
  /** Exists could be useful during the runtime to know if some service is running, option dep */
  running(packageId: PackageId): Promise<boolean>;
  restart(): void;
  shutdown(): void;
};

// prettier-ignore
export type ExtractWrapperData<WrapperData, Path extends string> = 
  Path extends `/${infer A }/${infer Rest }` ? (A extends keyof WrapperData ? ExtractWrapperData<WrapperData[A], `/${Rest}`> : never) :
  Path extends `/${infer A }` ? (A extends keyof WrapperData ? WrapperData[A] : never) :
  never

// prettier-ignore
type _EnsureWrapperDataPath<WrapperData, Path extends string, Origin extends string> = 
Path extends `/${infer A }/${infer Rest }` ? (A extends keyof WrapperData ? ExtractWrapperData<WrapperData[A], `/${Rest}`> : never) :
Path extends `/${infer A }` ? (A extends keyof WrapperData ? Origin : never) :
never
// prettier-ignore
export type EnsureWrapperDataPath<WrapperData, Path extends string> = _EnsureWrapperDataPath<WrapperData, Path, Path>

/* rsync options: https://linux.die.net/man/1/rsync
 */
export type BackupOptions = {
  delete: boolean;
  force: boolean;
  ignoreExisting: boolean;
  exclude: string[];
};
/**
 * This is the metadata that is returned from the metadata call.
 */
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
  message: string;
  value: null | {
    value: string;
    copyable: boolean;
    qr: boolean;
  };
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

export type PackageId = string;
export type Message = string;
export type DependencyKind = "running" | "exists";

export type DependsOn = {
  [packageId: string]: string[];
};

export type KnownError =
  | { error: string }
  | {
      "error-code": [number, string] | readonly [number, string];
    };

export type PackageProperties = PackagePropertyGroup | PackagePropertyString;
export type PackagePropertyString = {
  type: "string";
  name: string;
  description: string | null;
  value: string;
  /** Let's the ui make this copyable button */
  copyable: boolean;
  /** Let the ui create a qr for this field */
  qr: boolean;
  /** Hiding the value unless toggled off for field */
  masked: boolean;
};
export type PackagePropertyGroup = {
  value: PackageProperties[];
  type: "object";
  name: string;
  description: string;
};

export type Properties = PackageProperties[];

export type Dependency = {
  id: PackageId;
  kind: DependencyKind;
};
export type Dependencies = Array<Dependency>;

export type DeepPartial<T> = T extends {}
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;
