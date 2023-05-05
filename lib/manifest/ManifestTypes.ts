import { ValidEmVer } from "../emverLite/mod"
import { ActionMetaData } from "../types"

export interface Container {
  /** This should be pointing to a docker container name */
  image: string
  /** These should match the manifest data volumes */
  mounts: Record<string, string>
  /** Default is 64mb */
  shmSizeMb?: `${number}${"mb" | "gb" | "b" | "kb"}`
  /** if more than 30s to shutdown */
  sigtermTimeout?: `${number}${"s" | "m" | "h"}`
}

export type ManifestVersion = ValidEmVer

export interface SDKManifest {
  /**  The package identifier used by the OS. This must be unique amongst all other known packages */
  id: string
  /** A human readable service title */
  title: string
  /** Service version - accepts up to four digits, where the last confirms to revisions necessary for StartOs
   * - see documentation: https://github.com/Start9Labs/emver-rs. This value will change with each release of
   * the service
   */
  version: ManifestVersion
  /** Release notes for the update - can be a string, paragraph or URL */
  releaseNotes: string
  /** The type of license for the project. Include the LICENSE in the root of the project directory. A license is required for a Start9 package.*/
  license: string // name of license
  /** A list of normie (hosted, SaaS, custodial, etc) services this services intends to replace */
  replaces: string[]
  /** The Start9 wrapper repository URL for the package. This repo contains the manifest file (this),
   * any scripts necessary for configuration, backups, actions, or health checks (more below). This key
   * must exist. But could be embedded into the source repository
   */
  wrapperRepo: string
  /** The original project repository URL. There is no upstream repo in this example */
  upstreamRepo: string
  /**  URL to the support site / channel for the project. This key can be omitted if none exists, or it can link to the original project repository issues */
  supportSite: string
  /** URL to the marketing site for the project. If there is no marketing site, it can link to the original project repository */
  marketingSite: string
  /** URL where users can donate to the upstream project */
  donationUrl: string | null
  /**Human readable descriptions for the service. These are used throughout the StartOS user interface, primarily in the marketplace. */
  description: {
    /**This is the first description visible to the user in the marketplace */
    short: string
    /** This description will display with additional details in the service's individual marketplace page */
    long: string
  }
  /** These assets are static files necessary for packaging the service for Start9 (into an s9pk).
   * Each value is a path to the specified asset. If an asset is missing from this list, or otherwise
   * denoted, it will be defaulted to the values denoted below.
   */
  assets: {
    icon: string // file path
    instructions: string // file path
    license: string // file path
  }
  /** Defines the containers needed to run the main and mounted volumes */
  containers: Record<string, Container>
  /** This denotes any data, asset, or pointer volumes that should be connected when the "docker run" command is invoked */
  volumes: Record<string, "data" | "assets">
  actions: Array<ActionMetaData>
  alerts: {
    install: string | null
    update: string | null
    uninstall: string | null
    restore: string | null
    start: string | null
    stop: string | null
  }
  dependencies: Record<string, ManifestDependency>
}

export interface ManifestDependency {
  /** The range of versions that would satisfy the dependency
   *
   * ie: >=3.4.5 <4.0.0
   */
  version: string
  /**
   * A human readable explanation on what the dependency is used for
   */
  description: string | null
  requirement:
    | {
        type: "opt-in"
        /**
         * The human readable explanation on how to opt-in to the dependency
         */
        how: string
      }
    | {
        type: "opt-out"
        /**
         * The human readable explanation on how to opt-out to the dependency
         */
        how: string
      }
    | {
        type: "required"
      }
}
