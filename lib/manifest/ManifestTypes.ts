import { ValidEmVer } from "../emverLite/mod";
import { ActionResult } from "../types";

export interface Container {
  image: string;
  mounts: Record<string, string>;
  shmSizeMb?: number; // if greater
  sigtermTimeout?: string; // if more than 30s to shutdown
}

export type ManifestVersion = ValidEmVer;

export interface GenericManifest {
  id: string;
  title: string;
  version: ManifestVersion;
  releaseNotes: string;
  license: string; // name of license
  replaces: string[];
  wrapperRepo: string;
  upstreamRepo: string;
  supportSite: string;
  marketingSite: string;
  donationUrl: string | null;
  description: {
    short: string;
    long: string;
  };
  assets: {
    icon: string; // file path
    instructions: string; // file path
    license: string; // file path
  };
  containers: Record<string, Container>;
  volumes: Record<string, string>;
  actions: ActionResult[];
  alerts: {
    install: string | null;
    update: string | null;
    uninstall: string | null;
    restore: string | null;
    start: string | null;
    stop: string | null;
  };
  dependencies: Record<string, Dependency>;
}

export interface Dependency {
  version: string;
  description: string | null;
  requirement:
    | {
        type: "opt-in";
        how: string;
      }
    | {
        type: "opt-out";
        how: string;
      }
    | {
        type: "required";
      };
}
